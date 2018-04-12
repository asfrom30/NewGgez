import RESOURCE from './resource/resource.const';

import rules from './rules/rules.const'
import statMap from './map/stat-map';
import heroIndexes from './indexes/hero-indexes';
import tierIndexes from './indexes/tier-indexes';

/* Labels */
import summaryPageLabel from './label/lang/ko-kr/summary.page.label';

export default {
    rules : rules,
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
    statMap : statMap,
    heroIndexes : heroIndexes,
    tierIndexes : tierIndexes,
};