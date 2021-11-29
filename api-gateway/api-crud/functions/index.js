const AWS = require('aws-sdk');

AWS.config.update( {
    region: 'us-east-1'
});

// Using the Document Client for Dynamo makes it easier to read and write data, versus just DynamoDB
// e.g. const dynamo = new AWS.DynamoDB();
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Dynamo table name where product inventory is stored
const dynamodbTableName = 'product-inventory';

// Health path in API Gateway
const healthPath = '/health';

// Product path in API Gateway
const productPath = '/product';

// Products paht in API Gateway
const productsPath = '/products';

exports.handler = async (event) => {
    console.log('Request event: ', event);

    let response;

    // Determine execution operations based on httpMethod and path included in the event
    switch(true) {
        // If the httpMethod value in the event object is GET & the path value is the preset healthPath value (/health), execute the buildResponse function
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200);
            break;
        // If the httpMethod value in the event object is GET & the path value is the preset productPath value (/product), 
        //      execute the getProduct function with the productId value - from the nested object queryStringParameters in the event object - as a parameter
        case event.httpMethod === 'GET' && event.path === productPath:
            response = await getProduct(event.queryStringParameters.productId);
            break;
        // If the httpMethod value in the event object is GET & the path value is the preset productsPath value (/products), execute the getProducts function
        case event.httpMethod === 'GET' && event.path === productsPath:
            response = await getProducts();
            break;
        // If the httpMethod value in the event object is POST & the path value is the preset productPath value (/product),
        //      execute the saveProduct function with the body value from the event object
        case event.httpMethod === 'POST' && event.path === productPath:
            console.log("non-json: ", event.body)
            console.log("json: ", JSON.parse(event.body))
            response = await saveProduct(JSON.parse(event.body));
            break;
        // If the httpMethod value in the event object is PATCH & the path value is the preset productPath value (/product),
        //      execute the modifyProduct function with the productId, updateKey, and updateValue values from requestBody
        case event.httpMethod === 'PATCH' && event.path === productPath:
            const requestBody = JSON.parse(event.body);
            response = await modifyProduct(requestBody.productId, requestBody.updateKey, requestBody.updateValue);
            break;
        // If the httpMethod value in the event object is DELETE & the path value is the preset productPath value (/product),
        //      execute the deleteProduct function with the productId value from the body of the event object
        case event.httpMethod === 'DELETE' && event.path === productPath:
            response = await deleteProduct(JSON.parse(event.body).productId);
            break;
    }

    return response;
}

const buildResponse = (statusCode, body) => {
    return {
        // 200 OK HTTP status 
        statusCode: statusCode,
        // Parse the result into JSON.  This is a response header that declares the type of the resource.
        headers: {
            'Content-Type': 'application/json'
        },
        // Converts JS object to a JSON string
        body: JSON.stringify(body)
    }
}

const getProduct = async (productId) => {
    // Parameters for Dynamo table and the productId to reference
    // productId is passed thourgh in the request 
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'productId': productId
        }
    }

    return await dynamodb.get(params).promise().then((response) => {
        return buildResponse(200, response.Item);
    }, (error) => {
        // Console.error writes to stderr, while console.log rights to stdout
        console.error('Error getting the product information: ', error);
    });
}

const getProducts = async () => {
    // Only parameter is the DDB Table name
    const params = {
        TableName: dynamodbTableName
    }

    // Reference scanDynamoRecords function
    const allProducts = await scanDynamoRecords(params, []);
    
    // All products found in a scan of the DDB table
    const body = {
        products: allProducts
    }
    
    return buildResponse(200, body);
}

const scanDynamoRecords = async (scanParams, itemArray) => {
    try {
        // JS SDK Scan operations: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#scan-property
        const dynamoData = await dynamodb.scan(scanParams).promise();
        
        // Adds returned itmes into itemArry
        itemArray = itemArray.concat(dynamoData.Items);
        
        // If total # of scanned items exceeds max of 1MB, scan stops and results returned to user as a LastEvaluatedKey value 
        // Continues scan in subsequent operation
        if (dynamoData.LastEvaluatedKey) {
            scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }

        // Returns array with all items from the product-inventory table
        return itemArray;

    } catch(error) {
        console.error('Error getting the products in the table: ', error);
    }
}

const saveProduct = async (requestBody) => {
    // Two params: DDB table and the item info, which is provided from the required requestBody input
    const params = {
      TableName: dynamodbTableName,
      Item: requestBody
    }

    // PUT operations and response returned
    return await dynamodb.put(params).promise().then(() => {
      const body = {
        Operation: 'SAVE',
        Message: 'SUCCESS',
        Item: requestBody
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Error message: ', error);
    })
  }
  
const modifyProduct = async (productId, updateKey, updateValue) => {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'productId': productId
      },
      UpdateExpression: `set ${updateKey} = :value`,
      ExpressionAttributeValues: {
        ':value': updateValue
      },
      ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then((response) => {
      const body = {
        Operation: 'UPDATE',
        Message: 'SUCCESS',
        UpdatedAttributes: response
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }
  
const deleteProduct = async (productId) => {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'productId': productId
      },
      ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
      const body = {
        Operation: 'DELETE',
        Message: 'SUCCESS',
        Item: response
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
}
  