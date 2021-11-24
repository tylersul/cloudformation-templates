# API w/ CRUD Operations

## Description
API Gateway integrated with a Lambda function and DynamoDB Table backend that demonstrates basic CRUD operations.  

## Infrastructure
- API Gateway
- Lambda function
- DynamoDB Table

## API
### /health
Health check path to confirm function of the API.

**Method - GET**

Returns 200 HTTP response code to confirm functionality is working as expected.

### /products
**METHOD - GET**

Returns all products from the product-inventory Dynamo table.

Response example:

```json
{
    "products": [
        {
            "inventory": 100001,
            "price": 150,
            "color": "red",
            "productId": "1001",
            "productName": "product"
        }
    ]
}
```

### /product
Various operations on single products.

**METHOD - GET**

Required Parameters:
Query parameter with the product id, productId.
E.g. /product?productId=1001

Response example:

```json
{
    "inventory": 100001,
    "price": 150,
    "color": "red",
    "productId": "1001",
    "productName": "product"
}
```

**METHOD - POST**

Required parameters:
Request body with the productId and any other attributes associated with the item.

Request example:

```json
{
    "productId": "1001",
    "price": 150,
    "productName": "product",
    "color": "red",
    "inventory": 1000
}
```

Response example:

```json
{
    "Operation": "SAVE",
    "Message": "SUCCESS",
    "Item": {
        "productId": "1002",
        "price": 150,
        "productName": "product",
        "color": "red",
        "inventory": 1000
    }
}
```

**METHOD - PATCH**

Required parameters:
Request body with the productId, an updateKey (the attribute that will be updated), and the updateValue.

Request example:

```json
{
    "productId": "1001",
    "updateKey": "inventory",
    "updateValue": 100002
}
```
Response example:

```json
{
    "Operation": "UPDATE",
    "Message": "SUCCESS",
    "UpdatedAttributes": {
        "Attributes": {
            "inventory": 100002
        }
    }
}
```

**METHOD - DELETE**

Required parameters:
Query parameter with the product id, productId.
E.g. /product?productId=1001

Response example:

```json
{
    "Operation": "DELETE",
    "Message": "SUCCESS",
    "Item": {
        "Attributes": {
            "inventory": 100002,
            "price": 150,
            "color": "red",
            "productId": "1001",
            "productName": "product"
        }
    }
}
```