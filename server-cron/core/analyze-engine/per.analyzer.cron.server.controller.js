// db.getCollection('diff-datas-week').aggregate([
//     {
//      $addFields: {
//        'all.solo_kill_per_death' : {$cond : [
//             {'$and' : [
//                     {'$gt' : ["$all.death", 0]},
//                     {'$gt' : ["$all.solo_kills", 0]}
//              ]}
//            , { '$divide' : ["$all.solo_kills", "$all.death"]}
//            , null
//        ]}
//      }
//    },
    
// ]);