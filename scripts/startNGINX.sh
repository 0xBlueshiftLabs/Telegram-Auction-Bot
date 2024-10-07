sudo chown -R $(id -un) ./

export NGROK_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".NGROK_PORT");
export BOT_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".BOT_PORT");
export WEBAPP_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".WEBAPP_PORT");
export NODE_PORT=$(cat ./config/config.dev.json  | ./binaries/jq-binary -r ".NODE_PORT");

./nginx-files/sbin/nginx -p ./nginx-files -s quit
./nginx-files/sbin/nginx -p ./nginx-files -s stop

NGINX_PROCESS=$(pgrep nginx)

echo $NGINX_PROCESS

if [[ ! -z "$NGINX_PROCESS" ]];
then
    echo "\nNGROK is already running with process id $NGINX_PROCESS, shutting it down";
    for pid in $NGINX_PROCESS; do kill -9 $NGINX_PROCESS; done;
fi

export NEXT_LOCATION="$(pwd)/apps/webApp/.next/"

envsubst '$NGROK_PORT,$BOT_PORT,$WEBAPP_PORT,$NEXT_LOCATION,$NODE_PORT' < ./binaries/config.conf > ./nginx-files/conf/nginx.conf.default

./nginx-files/sbin/nginx -p ./nginx-files -c conf/nginx.conf.default;

echo NGINX STARTED