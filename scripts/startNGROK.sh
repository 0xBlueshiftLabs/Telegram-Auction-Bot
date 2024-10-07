NGROK_PORT=$(cat ./config/config.dev.json | ./binaries/jq-binary -r ".NGROK_PORT");

NGROK_PROCESS=$(pgrep ngrok)


if [[ ! -z "$NGROK_PROCESS" ]];
then
    echo "\nNGROK is already running with process id $NGROK_PROCESS, shutting it down";
    kill $NGROK_PROCESS;
fi

yarn ngrok  http $NGROK_PORT