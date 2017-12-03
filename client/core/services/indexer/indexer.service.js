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
                        result.B = CoreUtils.getDateIndex(7);
                        result.B = '17-11-05';

                        /* for dummy data*/
                        result.A = 'current';
                        result.B = '17-11-05';
                        break;
                    case 'yesterday' : 
                        result.A = CoreUtils.getDateIndex(0);
                        result.B = CoreUtils.getDateIndex(1);

                        /* dummy 25,26,27,28(current)*/
                        result.A = '17-11-06';      
                        result.B = '17-11-05';
                        break;
                    case 'today' :
                        result.A = "current";
                        result.B = CoreUtils.getDateIndex(0);

                        /* dummy 25,26,27,28(current)*/
                        result.A = "current";      
                        result.B = '17-11-06';

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