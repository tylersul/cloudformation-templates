# API Gateway with Cognito Authorizer

&nbsp;

## Description
Example showing API Gateway locked down through Cognito User Pools.  Only registered users with a token are able to make requests through the gateway.

&nbsp;
&nbsp;

## Infrastructure 
- API Gateway
- Lambda
- Cognito

&nbsp;
&nbsp;

## API Gateway
### /health
Health check path to confirm function of the API.

**METHOD - GET**

Returns 200 HTTP reponse code, along with a message body.

Response example:

```json
{
    "This signals a successful API call with a Cognito User token."
}
```

&nbsp;
&nbsp;

## Lambda
Integrated with the GET method on the /health path for the API Gateway.
Returns a simple response with a 200 HTTP code and message body.

&nbsp;
&nbsp;

## Cognito

Creates a User Pool (ApiUserPool), a User Pool Client (UserPoolCognitoApi), and a User Pool Domain (exampledomainforapi.)  

&nbsp;

Users can navigate to the created Cognito UI domain, create an account associated w/ their email address, and verify their account.  Once verified, they can login and use their token from the successful login callback URL to authenticate API calls.

&nbsp;

API calls must utilize the 'authorization' header created as the API Gateway Authorizer Identity Source.  See the API Gateway Authorizer resource in this template for more details.

&nbsp;
&nbsp;
#### Helpful Resources
Video guide in the AWS console similar to this template's contents can be found [here](https://www.youtube.com/watch?v=oFSU6rhFETk).

