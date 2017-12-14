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
                        result.B = '171105';

                        /* for dummy data*/
                        result.A = 'current';
                        result.B = '171105';
                        break;
                    case 'yesterday' : 
                        result.A = CoreUtils.getDateIndex(0);
                        result.B = CoreUtils.getDateIndex(1);

                        /* dummy 25,26,27,28(current)*/
                        result.A = '171106';      
                        result.B = '171105';
                        break;
                    case 'today' :
                        result.A = "current";
                        result.B = CoreUtils.getDateIndex(0);

                        /* dummy 25,26,27,28(current)*/
                        result.A = "current";      
                        result.B = '171106';

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