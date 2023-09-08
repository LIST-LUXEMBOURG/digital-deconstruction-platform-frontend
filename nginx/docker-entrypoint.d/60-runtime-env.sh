#!/bin/bash

# Runtime Environment Variables
# Create a Javascript file based on the environment variables and
# inject it in the header of the index.html (public/index.html)
# Maintainer: Audren Guillaume for LIST (audren.guillaume@list.lu)

# Note: In environment file, there is a prohibited symbol in the comments: "equals"
ENV_PATH="/usr/share/nginx/html"
ENV_FILE_PATH="$ENV_PATH/.env"
ENV_COPY="$ENV_PATH/.env-copy"
TMP_FILE_PATH="$ENV_PATH/env-config-1.js"
JS_FILE_PATH="$ENV_PATH/env-config.js"

#Recreate config file
rm -rf $TMP_FILE_PATH
touch $TMP_FILE_PATH

# Remove \r, empty line and comments from .env-copy
sed 's/\r//;/^$/d;/#.*$/d' $ENV_FILE_PATH >$ENV_COPY

# Add assignment
echo "window.__env__ = {" >>$TMP_FILE_PATH

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]]; do
    # Split env variables by character `=`
    if printf '%s\n' "$line" | grep -q -e '='; then
        varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
        varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
    fi

    # Read value of current variable if exists as Environment variable
    value=$(printf '%s\n' "${!varname}")
    # Otherwise use value from .env file
    [[ -z $value ]] && value=${varvalue}

    # Append configuration property to JS file
    echo "  $varname: \"$value\"," >>$TMP_FILE_PATH
done <$ENV_COPY

echo "}" >>$TMP_FILE_PATH

# FIX: replace Windows EOL (\r\n) with Linux EOL (\n)
sed 's/\r//' $TMP_FILE_PATH >$JS_FILE_PATH

# Remove tmp files
rm $TMP_FILE_PATH
rm $ENV_COPY
