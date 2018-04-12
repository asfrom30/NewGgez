# Build
* pre
    * clean local
* build
    * server
        * transpile
        * copy extras
    * clinet
        * assets
        * webpakc

# Deploy
* pre
    * clean remote
* build

# Run (only server)
* pre
    * npm install
* run 
    * local
        * development
        * dist
    * remote
        * production
        * dryrun

## Manual Full build
```
$ gulp copy:.secrets
$ gulp build:server
$ gulp build:client
```

## Deploy
* `auto:deploy:server`
* `auto:deploy:cron`
* `auto:deploy:client`
* `auto:deploy:client:simple`

## Dev
* `serve`
* `serve:debug`

* `start:server:dev`
* `start:server:dist`
* `start:client`


## Consider 
* `run:local:dist`
* `run:local:dev` instead of `serve`
* `run:remote:dist`