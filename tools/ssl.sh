echo "Generating SSL Certificate"
/opt/local/bin/openssl req -x509 -nodes -subj '/CN=*' \
    -newkey rsa:4096 -days 365 \
    -keyout etc/ssl/default.pem \
    -out etc/ssl/default.pem
echo "generated ok"