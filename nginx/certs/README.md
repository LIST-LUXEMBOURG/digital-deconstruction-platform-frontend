# Create a self-signed certificate

## Command

```bash

$ openssl req -x509 -newkey rsa:4096 -nodes -keyout self-signed.key -out self-signed.cert -sha256 -days 365 -subj '/CN=localhost'

```

## Explaination

### req

PKCS#10 X.509 Certificate Signing Request (CSR) Management.

### -x509

This option outputs a self signed certificate instead of a certificate request.

This is typically used to generate a test certificate or a self signed root CA.

The extensions added to the certificate (if any) are specified in the configuration file.

Unless specified using the set_serial option, a large random number will be used for the serial number.

If existing request is specified with the -in option, it is converted to the self signed certificate otherwise new request is created.

### -newkey rsa:4096

This option creates a new certificate request and a new private key.

The argument takes one of several forms. rsa:nbits, where nbits is the number of bits, generates an RSA key nbits in size.

If nbits is omitted, i.e. -newkey rsa specified, the default key size, specified in the configuration file is used.

### -nodes

Shorts for "no DES". If this option is specified then if a private key is created it will not be encrypted.

### -keyout self-signed.key

This gives the filename to write the newly created private key to. If this option is not specified then the filename present in the configuration file is used.

### -out self-signed.cert

This specifies the output filename to write to or standard output by default.

### -sha256

The certificate format in sha-256 digest.

### -days 365

When the -x509 option is being used this specifies the number of days to certify the certificate for, otherwise it is ignored. n should be a positive integer. The default is
30 days.

### -subj '/CN=localhost'

Sets subject name for new request or supersedes the subject name when processing a request.

The arg must be formatted as /type0=value0/type1=value1/type2=.... Keyword characters may be escaped by \ (backslash), and whitespace is retained.

Empty values are permitted, but the corresponding type will not be included in the request.
