const ResizeSensor = require('css-element-queries/src/ResizeSensor');

export default angular
    .module('resize.sensor.common.service.module', [])
    .factory('ResizeSensor', function(){
        return ResizeSensor;
    }).name;