# Installation instructions and libraries

## Prerequisities

- [Node](https://nodejs.org/en/) >= 11.x
- [Docker](https://docs.docker.com/v17.09/engine/installation/linux/docker-ce/ubuntu/) >= v19.x
- [Vue CLI](https://cli.vuejs.org/) >= 4.x
- Http server of you choice (nginx, apache, http-server)

On Linux platforms, the Node Version Manager ([NVM](https://github.com/nvm-sh/nvm)) is recommended.

> http-server can be install via `$ npm install -g http-server`

## Installation

```bash
$ git clone ['insert git link here']
$ npm install
```

## Deployement

The deployement can be done in many ways:

- development or production
- HTTP or HTTPS
- minified or not
- ...

It is recommended to deploy the application in HTTPS. Thus, this guarantees the
good behavior of the functionalities.

```bash
# In development mode you can benefit of hot-reloads by running the serve command. (HTTP)
$ npm run serve

# The commands to build and run the application.
$ npm run build # This will generate a dist/ folder

# Then, you can serve it with an http server, example:
$ http-server dist/

# HTTPS example:
$ http-server dist/ -S -C server/certs/localhost.crt -K server/certs/localhost.key


# Via docker-compose (HTTPS)
# Similar to the above docker command, the only difference is that docker-compose
# include SSL certificate.
$ docker-compose up --build
```

Once the deployement done, you can access the API on:

- http://localhost:8080 [npm run serve, docker run]
- https://localhost:8080 [http-server]
- https://localhost [docker-compose]

For more informations: [Dockerfile](Dockerfile) | [docker-compose.yml](docker-compose.yml) | [HTTPS](#Security)

## More commands

```bash
# Run your unit tests
$ npm run test:unit
```

```bash
# To see i18n lint report run the command.
$ npm run i18n:report
```

> The following libraries were installed via the Vue CLI. [Read More](https://cli.vuejs.org/guide/creating-a-project.html#vue-create)

## Routing

[Vue Router](https://router.vuejs.org/)

## Internationalization (i18n)

[Vue I18n](https://kazupon.github.io/vue-i18n/introduction.html) (by Kazupon - a major contributor)

## State management

[Vuex](https://vuex.vuejs.org/)

## Http request

[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## UI components

[Vuetify](https://vuetifyjs.com/en/)

## Security

Nowaday, the security take an important part in most of the applications.

You can find many ways to apply security in your application, but here the topics are HTTPS and environment configuration.


Files: [Nginx](server/conf.d/app.conf) | [Dockerfile](Dockerfile) | [docker-compose](docker-compose.yml) | [certificate](server/certs/localhost.crt) + [key](server/certs/localhost.key)
