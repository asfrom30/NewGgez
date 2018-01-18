import RESOURCE from './resource/resource.const';

import heroIndexes from './heromap/heromap.const';
import tierMap from './map/tier.standard.constanat';
import DIFF_GAMES_MAP from './analyzer-map/diff-games/diff.games.analyzer.map.const';


/* Labels */
import summaryPageLabel from './label/lang/ko-kr/summary.page.label';

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
    resource : {

    },

    RESOURCE : RESOURCE,

    /* Const Map */
    tierMap : tierMap,
    heroIndexes : heroIndexes,
    DIFF_GAMES_MAP : DIFF_GAMES_MAP

};