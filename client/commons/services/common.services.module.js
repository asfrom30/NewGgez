'use strict';

import angular from 'angular';
import ResizeSensorModule from './resize-sensor/resize.sensor.common.service';

export default angular
    .module('common.services.module', [ResizeSensorModule])
    .name;