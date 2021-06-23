import * as sst from "@serverless-stack/resources";
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers'
import { ApiAuthorizationType } from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const { cognitoUserPool, cognitoUserPoolClient } = new sst.Auth(this, "Auth", {
      cognito: true,
    });

    const authorizer = cognitoUserPool && cognitoUserPoolClient &&
      new HttpUserPoolAuthorizer({
        userPool: cognitoUserPool,
        userPoolClient: cognitoUserPoolClient,
      })

    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        srcPath: "src",
        runtime: "python3.8"
      },
      routes: {
        "ANY /{proxy+}": {
          function: {
            handler: "api.handler",
          },
          authorizationType: ApiAuthorizationType.JWT,
          authorizer
        },
        "GET /docs": "api.handler",
        "GET /openapi.json": "api.handler"
      }
    });

    this.addOutputs({
      "ApiEndpoint": api.url,
      "CognitoUserPoll": cognitoUserPool?.userPoolId || "",
      "CognitoAppClient": cognitoUserPoolClient?.userPoolClientId || ""
    });
  }
}
