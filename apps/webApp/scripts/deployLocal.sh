WEBAPP_PORT=$(cat ../../config/config.dev.json  | jq -r ".WEBAPP_PORT");
WEBHOOK_URL=$(cat ../../config/config.dev.json  | jq -r ".WEBHOOK_URL");

# test -f .env || touch .env.local

# echo "WEBHOOK_URL=$WEBHOOK_URL" > .env.local

sudo yarn run next dev -p $WEBAPP_PORT