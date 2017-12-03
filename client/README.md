# GGEZ FRONTEND

## Code Features

### Reusable component

### Ajax Service
Loading Bar appear and disappear

### Folder Structure

### Image Resource
No hard wiring. see const resrouces.map.js(now resrouce.const.js)

### Custom Log
* set log config

```javascript
// app.constants.js

import constants from './const/constants';

export default angular.module('ggezkrApp.constants', [])
  .constant('CONFIG_LOG', constants.config.log)
  .name
```
```javascript
// constants.js
export default {
    label : {
        summaryPageLabel : summaryPageLabel,
    },

    config : {
        log : {
            isActivate : false,
            
            /* Log level */
            // logLevel : ['info', 'success', 'warn', 'error'],
            logLevel : ['info', 'success', 'warn', 'error'],
            
            /* Module Name */
            logScope : ['hero.detail'],
        }
    },
};

```

* Common Log
```javascript
//logger.common.util.service.js
'use strcit';

import angular from 'angular';

export default angular
    .module('logger.util.common.util.service',[]) 
    .factory('CommonLogService', CommonLogService)
    .name;

function CommonLogService() {
    return {
        colorLog : colorLog,
    }
}

function colorLog(message, color) {
    
    color = color || "black";

    switch (color) {
        case "success":  
                color = "Green"; 
                break;
        case "info":     
                color = "blue";  
                break;
        case "error":   
                color = "red";     
                break;
        case "warn":  
                color = "Orange";   
                break;
        default: 
                color = color;
    }

    console.log("%c" + message, "color:" + color);
}
```

* App Log
```javascript
//logger.core.util.service.js
'use strict';

import angular from 'angular';

export default angular
    .module('logger.core.utils.service', [])
    .service('AppLogger', function(CommonLogService, CONFIG_LOG){


        this.log = function(msg, type, scope){
            if(!CONFIG_LOG.isActivate) return;
            if(CONFIG_LOG.logLevel.includes(type) && CONFIG_LOG.logScope.includes(scope)){
                CommonLogService.colorLog(msg, type)
            }
        }

        this.table = function(obj, type){
            //if object.... how handle the object...
            // be able to apply scope mode... not color...
            // or table 
            console.table(obj)
        }


    }).name;
```

* Usage 

```javascript
// hero.detail.js
export function HeroDetailCtrl(AppLogger){

    var $ctrl = this;

    $ctrl.logScope = 'hero.detail';


    $ctrl.$onInit = function(){
        AppLogger.log('heelo', 'success', $ctrl.logScope);
        AppLogger.log('heelo', 'error', $ctrl.logScope);
        AppLogger.log('heelo', 'warn', $ctrl.logScope);
        AppLogger.log('heelo', 'info', $ctrl.logScope);
    }
```

### Better way to bind data


##### Changing data
Showing datas are changed depend on user input. In the first I binded `selected` data to `html` directly.

```html
<compare-table
    label-column = "$ctrl.labels[$ctrl.selector.hero]"
    first-column = "$ctrl.firstPlayerDiffData[$ctrl.selector.hero]"
    second-column = "$ctrl.secondPlayerDiffData[$ctrl.selector.hero]"
    third-column ="$ctrl.tierData[$ctrl.selecotr.hero]"/>
</compare-table>
```
But go farther and farther. `html`code gets dirty. It's not easy to know what happens. so I changed binding way like below.


```html
<compare-table
    label-column = "$ctrl.table.labelColumn"
    first-column = "$ctrl.table.firstColumn"
    second-column = "$ctrl.table.secondColumn"
    third-column ="$ctrl.table.thirdColumn"/>
</compare-table>
```
```javascript
function updateTableDataSet(p1Index, p2Index, tierIndex, heroIndex){
    $ctrl.table = {};
    $ctrl.table.labelColumn = $ctrl.cache.labels[heroIndex];
    $ctrl.table.firstColumn = $ctrl.cache.p1.diffDatas[p1Index][heroIndex].stats;
    $ctrl.table.secondColumn = $ctrl.cache.p2.diffDatas[p2Index][heroIndex].stats;
    $ctrl.table.thirdColumn = $ctrl.cache.tier[tierIndex][heroIndex];
}
```




### Other Feautres

### Webpack
* make webpack.config.js

* if you want to use `import` syntax install package which is relate to babel(babel-loader, babel-core etc)

* in the webpack config this option is very useful `devtool: 'inline-source-map',`

* if you want watch html and css file being changed. import that `import './{filename}.html'`;

* in the webpack syntax, use `name;`
```javascript
angular.module.xxx.name;
```

* To use full jquery(angular has only jqlite), Jquery plugin option must be declared also you need to install jquery package 
```javascript
plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery' // for angularjs
        })
        // new webpack.optimize.UglifyJsPlugin(),
        // new HtmlWebpackPlugin({template: './src/index.html'})
      ]
```
# Road Map and Task
## App Task
* Consider When current data is older than today, week, data...
## Angular Task
* Ajax Service Code separate with export
## Task
* Upload in AWS or Goolgle Cloude or Home Server(docker)
* Test Code Insert(Unit test and EE test)
* Build Strong Security
* Check CSS has influent Global or local
* Update Angularjs Bootstrap
* Webpack build and test.
* protractor
* travis ci

## RoadMap
* App
  * Apply Ajax Live Search at Friend search
    * [Ref1](https://www.sitepoint.com/14-jquery-live-search-plugins/)
    * [Ref2](https://www.npmjs.com/package/hideseek)
* Util
  * ng-enter needs auto-erasable and not working when blank field attribute
* View
  * Apply Grid Layout in css
    * [Grid Layout in Mozilla](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Box_Alignment_in_CSS_Grid_Layout)
    * [Youtube Grid Layout](https://www.youtube.com/watch?v=7kVeCqQCxlk&index=27&list=LL1mvPueScRGlIoAu-JaihZA&t=920s)
  


