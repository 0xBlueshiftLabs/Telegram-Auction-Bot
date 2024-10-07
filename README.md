# Auction Bot Monorepo

This monorepo contains the backend,frontend and subgraph code to setup and test the bot locally, as well as deploy to prod.

## Setup

### Initial setup

- cd to the root of the project
- Run the following command to install all yarn dependencies:
  `yarn run install-all`
- Now we add dependencies for nginx,jq and pcre :
  `yarn run install-proxy`
- Create a file called config.dev.json under the config folder and add the following data:
-     {
      "BOT_TOKEN":"botToken",
      "SECRET_KEY":"secretKey",
      "PRIVATE_KEY":"Only on dev",
      "NGROK_API_KEY":"Only on dev",
      "NGROK_PORT":"7777",
      "BOT_PORT":"8443",
      "WEBAPP_PORT":"8444",
      "LAMBDA_PORT":"6077"
      }
- Now we start the nginx server:
  `yarn run start-proxy`

If you made a change to the environment variables(or if you restarted your pc), just call the last command again to restart the proxy

### Backend setup

- cd to the root of the project (Not the backend folder)
- Start ngrok:
  `yarn run start-ngrok`
- Now in another terminal, setup your ngrok url as the tg bot webhook url:
  `yarn run setup-webhook`
- Now deploy the lambdas locally:
  `yarn run deploy-backend-local`

### Frontend setup

- cd to the root of the project (Not the frontend folder)
- Start the frontend:
  `yarn run deploy-webapp-local`
