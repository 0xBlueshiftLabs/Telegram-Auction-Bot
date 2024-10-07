sudo chown -R $(id -un) ./

#first install all yarn dependencies
sudo yarn run install-all

sudo mkdir nginx-files

cd binaries

#now give permissions to the jq binary
sudo chmod 777 jq-binary

#unzip nginx
sudo tar -xvzf nginx-1.12.2.tar.gz

#unzip pcre
sudo tar xvzf pcre-8.41.tar.gz

cd nginx-1.12.2/

./configure --with-pcre=../pcre-8.41/ --prefix=../../nginx-files

sudo make && make install
