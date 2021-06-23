import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        srcPath: "src",
      },
      routes: {
        "GET /v1/{items+}": "api.handler",
        "POST /v1/{items+}": "api.handler",
        "GET /docs": "api.handler",
      }
    });

    // Show the endpoint in the output
    this.addOutputs({
      "ApiEndpoint": api.url,
    });
  }
}
