module.exports = function(favoriteApi, thumbApi) {
    
    const obj = this;

    this.favoriteApi = favoriteApi;
    this.thumbApi = thumbApi;

    this.fetchThumbs = function(device, region) {
        const api = obj.thumbApi;
        return new Promise((resolve, reject) => {
            api.get({device : device, region : region}).$promise.then(response => {
                //TODO: response code handling
                const responseJson = response.toJSON();
                const result = responseJson.value.thumbs;
                resolve(responseJson.value.thumbs);
            }).catch(reason => {
                reject(reason);
            })
        })
    }

    this.addThumb = function(device, region, id) {
        const api = obj.thumbApi;
        return new Promise((resolve, reject) => {
            api.add({device : device, region : region, id : id}).$promise.then(response => {
                const responseJson = response.toJSON();
                resolve(responseJson.value);
            }).catch(reason => {
                reject(reason);
            })
        })
    }

    this.removeThumb = function(device, region, id) {
        const api = obj.thumbApi;
        return new Promise((resolve, reject) => {
            api.remove({device : device, region : region, id : id}).$promise.then(response => {
                const responseJson = response.toJSON();
                resolve(responseJson.value);
            }).catch(reason => {
                reject(reason);
            })
        })
    }
}