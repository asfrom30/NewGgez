/* Module Loading */
var path = require('path');
var Properties = require('properties');

const propertiesOption = {
    path:   true,
    namespaces: true,
    // include:    true,
    sections: true,
    reviver: function (key, value, section){
    //Do not split section lines 
    if (this.isSection) return this.assert ();

    //Split all the string values by a comma 
    if (typeof value === "string"){
        var values = value.split (",");
        return values.length === 1 ? value : values;
    }

    //Do not split the rest of the lines 
    return this.assert ();
    }
};

exports.getCronJobs = function(serverConfigPath){
    return new Promise((resolve, reject) => {
        Properties.parse (serverConfigPath, propertiesOption, function (error, obj){
            if (error) {
                reject(error);
            } else {
                var cronJobs = obj.cronjobs;
                resolve(cronJobs);
            }
        });
    });
}



