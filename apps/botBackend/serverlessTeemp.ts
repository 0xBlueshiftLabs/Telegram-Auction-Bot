import { Serverless } from "serverless/plugins/aws/provider/awsProvider";

const serverlessConfiguration: Serverless = {
  service: "auction-bot",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dynamodb", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "us-west-2",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    timeout: 900,
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: "*",
          },
        ],
      },
    },
  },
  custom: {
    bundle: {
      linting: false,
    },
    "serverless-dynamodb": {
      stages: ["dev", "prod", "staging"],
      start: {
        docker: true,
        port: 5678,
      },
    },
  },
  functions: {
    AuctionBotHandler: {
      handler: "src/functions/auctionBot.handler",
      url: true,
      environment: {
        BOT_TOKEN:
          "${file(../../config/config.${opt:stage, 'dev'}.json):BOT_TOKEN}",
        SECRET_KEY:
          "${file(../../config/config.${opt:stage, 'dev'}.json):SECRET_KEY}",
        PRIVATE_KEY:
          "${file(../../config/config.${opt:stage, 'dev'}.json):PRIVATE_KEY}",
        WEB_URL:
          "${file(../../config/config.${opt:stage, 'dev'}.json):WEBHOOK_URL}",
        CHAINID:
          "${file(../../config/config.${opt:stage, 'dev'}.json):CHAINID}",
        TABLE_NAME:
          "${file(../../config/config.${opt:stage, 'dev'}.json):TABLE_NAME}",
        WEBHOOK_SECRET:
          "${file(../../config/config.${opt:stage, 'dev'}.json):WEBHOOK_SECRET}",
        KMS_KEY_ID: { "Fn::GetAtt": ["AuctionBotKey", "KeyId"] },
      },
    },
  },
  resources: {
    Resources: {
      AuctionsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName:
            "${file(../../config/config.${opt:stage, 'dev'}.json):TABLE_NAME}",
          AttributeDefinitions: [
            {
              AttributeName: "auctionId",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "auctionId",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      AuctionBotKey: {
        Type: "AWS::KMS::Key",
        Properties: {
          // AliasName:"launchbot-${opt:stage, 'staging'}-key",
          // Description:"The master key that is used to generate private keys for users. Please do not use the staging key in prod.",
          // Enabled:true,
          KeyPolicy: {
            Version: "2012-10-17",
            Id: "launchbot-${opt:stage, 'staging'}-key",
            Statement: [
              {
                Sid: "${opt:stage, 'staging'}-iam-user-policy",
                Effect: "Allow",
                Principal: {
                  AWS: { "Fn::Sub": "arn:aws:iam::${AWS::AccountId}:root" },
                  //  "!Sub arn:aws:iam::${AWS::AccountId}:root"
                  // {
                  //       "Fn::Join": [
                  //           "",
                  //           [
                  //               "arn:aws:iam::",
                  //               {
                  //                   "Ref": "AWS::AccountId"
                  //               },
                  //               ":root"
                  //           ]
                  //       ]
                  //   }
                },
                Action: ["kms:*"],
                Resource: "*",
              },
              {
                Sid: "${opt:stage, 'staging'}-key-generation-policy",
                Effect: "Allow",
                Principal: {
                  AWS: {
                    "Fn::Sub":
                      "arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:auction-bot-${opt:stage, 'staging'}-AuctionBotHandler",
                  },
                },
                Action: ["kms:GenerateMac"],
                Resource: "*",
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
