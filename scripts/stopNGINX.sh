./nginx-files/sbin/nginx -p ./nginx-files -s quit
./nginx-files/sbin/nginx -p ./nginx-files -s stop

NGINX_PROCESS=$(pgrep nginx)

echo $NGINX_PROCESS

if [[ ! -z "$NGINX_PROCESS" ]];
then
    echo "\nNGROK is already running with process id $NGINX_PROCESS, shutting it down";
    for pid in $NGINX_PROCESS; do kill -9 $NGINX_PROCESS; done;
fi
