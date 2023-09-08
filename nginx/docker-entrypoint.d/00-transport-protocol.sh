#!/bin/bash

# Nginx Dynamic Transport Protocol
# Change from HTTP transport to HTTPS transport if a valid certificate/key combinaison is found
# in /etc/nginx/certs and /etc/nginx.key
# Maintainer: Audren Guillaume for LIST (audren.guillaume@list.lu)

CERT_NAME=${NGINX_CERT_NAME:-self-signed.cert}
CERT_PATH="/etc/nginx/certs/$CERT_NAME"
KEY_NAME=${NGINX_KEY_NAME:-self-signed.key}
KEY_PATH="/etc/nginx/private/$KEY_NAME"

TMPL_PATH="/etc/nginx/templates"

# echo "C $CERT_NAME $CERT_PATH"
# echo "K $KEY_NAME $KEY_PATH"

if [[ -f $CERT_PATH && -f $KEY_PATH ]]; then
    cp "$TMPL_PATH/https.conf" "$TMPL_PATH/default.conf.template"
else
    cp "$TMPL_PATH/http.conf" "$TMPL_PATH/default.conf.template"
fi
