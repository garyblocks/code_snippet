import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { PythonFunction } from "@aws-cdk/aws-lambda-python";

export interface LambdaStackProps extends cdk.StackProps {
  readonly stage: string;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const functionName = 'MyLambda';
    const role = new iam.Role(this, `${functionName}-LambdaRole`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaExecute"),
      ],
    });
    role.addToPolicy(new iam.PolicyStatement({
      actions: ["sts:AssumeRole"],
      resources: ["*"],
    }));

    const lambda = new PythonFunction(this, functionName, {
      role,
      entry: `../lambdas/${functionName}`,
      index: 'index.py',
      handler: 'handler',
      memorySize: 3008,
      timeout: cdk.Duration.seconds(900),  // max execution time
      description: 'My lambda example'
    });
  }
}
