export NGROK_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".NGROK_PORT");
export BOT_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".BOT_PORT");
export LAMBDA_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".LAMBDA_PORT");
export SECRET_KEY=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".SECRET_KEY");
export BOT_TOKEN=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".BOT_TOKEN");
export NGROK_API_KEY=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".NGROK_API_KEY");
export PRIVATE_KEY=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".PRIVATE_KEY");
export WEBAPP_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".WEBAPP_PORT");
export NODE_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".NODE_PORT");
export CHAINID=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".CHAINID");
export TABLE_NAME=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".TABLE_NAME");

RESPONSE_CODE=$(curl -s -o /dev/null -w "%{response_code}" -X POST  "https://api.telegram.org/bot$BOT_TOKEN/deleteWebhook");

if [[ $RESPONSE_CODE -ne 200 ]]; 
then
    echo "Error while deleting webhook"
    exit 1
fi

FLAG=0

for i in {1..5}
do
    
    export WEBHOOK_URL=$(curl -X GET -H "Authorization: Bearer $NGROK_API_KEY" -H "Ngrok-Version: 2" https://api.ngrok.com/tunnels  | ./binaries/jq-binary -r ".tunnels[0].public_url")
    if [[ ! -z "$WEBHOOK_URL" ]];
    then
        if [ $WEBHOOK_URL != "null" ]; then
            echo $WEBHOOK_URL
            echo "\nNGROK SERVER STARTED!";
            echo "\nUPDATING WEBHOOK URL";
            RESPONSE_CODE=$(curl -s -o /dev/null -w "%{response_code}" -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook?url=$WEBHOOK_URL/dev/auctionBotHandler&secret_token=$SECRET_KEY");
            if [[ $RESPONSE_CODE -ne 200 ]]; 
            then
                continue
            fi
            FLAG=1;

            envsubst < ./config/config.dev.template.json > ./config/config.dev.json

            cd ./packages
            test -f .env || touch .env

            echo "WEBHOOK_URL=$WEBHOOK_URL" > .env
            cd ..
            break;
        fi
    fi
done

if [[ $FLAG -eq 0 ]];
then 
    echo "\nError setting up the webhook!"
    exit 1;
else
    echo "\nSuccessfully setup webhook!"
fi

