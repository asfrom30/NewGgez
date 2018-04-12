


# Client


```js
// result

//error
{
    errMsg : "", // for client
    errors : "", // for client form
    errLog : "", // for develop
}
```

```js

const logFlag = LOG_SETTING.FLAG; // only for dev mode


{api}.(response => {
    const result = response.toJSON();
}, reason => {
    const statusCode = reason.status;
    const result = reason.data;

    if(logFlag) console.log(result.errLog); // err is relate to server error

    Noty.show(`NOTY.SERVER.${result.errMsg}`, 'warning', 1000, function(){
        $state.go(`freeboard.list`, {}, { reload: true });
    });
})

```