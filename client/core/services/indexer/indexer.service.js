export default angular
    .module('core.indexer', [])
    .factory('Indexer', function(CoreUtils){
        return {
            /* dataA - dataB */
            // getIndexes : getIndexes,
            getIndexes : function (selectedDate) {
                let result = {};
                switch(selectedDate) {
                    case 'week' : 
                        result.A = "current";
                        result.B = CoreUtils.getWeekIndex();
                        break;
                    case 'yesterday' : 
                        result.A = CoreUtils.getTodayIndex();
                        result.B = CoreUtils.getYesterIndex();
                        break;
                    case 'today' :
                        result.A = "current";
                        result.B = CoreUtils.getTodayIndex();
                        break;
                    case 'season' :
                        result.A = "current";
                        result.B = undefined;
                        break;
                    default :
                        result.A = "current";
                        result.B = selectedDate;
                        break;  
                }
                return result;
            },
        }
    }).name;

// export function getIndexes (selectedDate) {
//     let result = {};
//     switch(selectedDate) {
//         case 'week' : 
//             result.A = "current";
//             result.B = CoreUtils.getDateIndex(7);
//             break;
//         case 'yesterday' : 
//             result.A = CoreUtils.getDateIndex(0);
//             result.B = CoreUtils.getDateIndex(1);
//             break;
//         case 'today' :
//             result.A = "current";
//             result.B = CoreUtils.getDateIndex(0);
//             break;
//         default :
//             result.A = "current";
//             result.B = selectedDate;
//             break;  
//     }
//     return result;
// }