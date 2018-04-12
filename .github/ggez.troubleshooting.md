# Server Trouble Shooting
### Cross-Origin-Resource-Sharing

```
// Webbrowser message
Failed to load http://localhost:3000/stored-btgs: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:9000' is therefore not allowed access.
```


# Cron Trouble Shooting
### Be careful use cronjob with pm2
pm2 restart task when task is ended. so if you didn't run cron job. it ends immediately and restart task. Thats' why cron job is not working properly.

```json
// in config.js
cron : {
    context: null,
    start: false, // don't use false mode in pm2
    runOnInit: true,
}
```
