
exports.refine = function(lang, objs){
    /**_meta refine */

    /* _value refine */
    var tempResult = {};

    for(var heroKey in objs._value){
        var heroObjs = objs._value[heroKey];
        
        var childResult = {};

        //TODO heroObjs object check...
        for(var statKey in heroObjs){
            let value = heroObjs[statKey];

            if (!(typeof value === 'string' || value instanceof String)) continue;
            
            statKey = statKey.replace(/\s/g,''); // remove White Space
            statKey = statKey.replace(/\./g,'_comma_'); // remove comma 
            value = value.replace(/\s/g,'');

            /* Time conversion */
            if(statKey.includes('시간') | value.includes(':')){
                value = encodeTime(value);
                value += "%timestamp"
            } else if(value.includes('%')) {
                // % nothing to do....
            } else {
                value = value.replace(/\,/g,'');
                value = parseFloat(value);
            }
            childResult[statKey] = value;
        }
        tempResult[heroKey.toLowerCase()] = childResult;
    }
    objs._value = tempResult;

    return objs;
}


function isTime(value){
    var result = value.search(':');
    if(result == -1) return false;
    else return true;
}

function encodeTime(timeStr){
    // 시 분 초.... 는 어떻게 해결.... 
    var matches = timeStr.match(/\d+/g);
    
    if(matches == null) return 0;

    var matchesInt = [];
    for(var match of matches){
        var parsedInt = parseInt(match);
        if(isNaN(parsedInt)) return -1;
        matchesInt.push(parsedInt);
    }

    switch(matchesInt.length) {
        case 1:
            return matchesInt[0];
        case 2:
            return matchesInt[0]*60 + matchesInt[1];
        case 3:
            return matchesInt[0]*60*60 + matchesInt[1]*60 + matchesInt[2];
        default:
            return -1;
    }
}

function decodeTime(timeStr){
    
}