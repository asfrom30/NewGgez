/* version 0.1*/

// OVERWATCH.GUID.0X0860000000000030 발사
// OVERWATCH.GUID.0X0860000000000031 명중
// OVERWATCH.GUID.0X0860000000000033 치명타 (치명타명중률 = 치명타/명중)
module.exports =  {
    "all" : [
        { "label": "목숨당피해량", "desc" : "피해량/죽음" ,"unit" : "/", "numerator" : "준피해", "denominator" : "죽음", "description" : ""},
    ],
    "soldier76" : [
        // { "label": "명중율", "unit" : "", "numerator" : "", "denominator" : "발사", "description"}
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준피해", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당처치", "unit" : "/", "numerator" : "준피해", "denominator" : "죽음", "description" : ""},
        
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        { "label": "경기당나선로켓처치", "unit" : "/", "numerator" : "나선로켓으로처치", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당전술조준경처치", "unit" : "/", "numerator" : "전술조준경으로처치", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당생체장치유량", "unit" : "/", "numerator" : "생체장으로치유", "denominator" : "치른게임", "description" : ""}
    ],
    "reaper" : [
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},

        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""}

        //TODO : add to special skills
        // array( "label" => "거둔영혼", "description" => "한 게임당 거둔영혼", "unit" => "", "factor" => array(1, "거둔 영혼","치른 게임", "거둔 영혼 - 평균"), "grade"=> array(0, 4, 6, 8, 30)),
        // array( "label" => "궁극", "description" =>"한 게임당 죽음의 꽃으로 처치", "unit" => "", "factor" => array(1, "죽음의 꽃으로 처치", "치른 게임", "죽음의 꽃으로 처치 - 평균"), "grade"=> array(0, 4, 6, 8, 10))
    ],
    "parah" : [
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당영웅피해량", "unit" : "/", "numerator" : "영웅에게준피해", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당방벽피해량", "unit" : "/", "numerator" : "방벽에준피해", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},

        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""}

        //TODO : add to special skills
    ],
    "reinhardt" : [
        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당막은피해", "unit" : "/", "numerator" : "막은피해", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당돌진으로처치", "unit" : "/", "numerator" : "돌진으로처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당화염강타로처치", "unit" : "/", "numerator" : "대지분쇄로처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당대지분쇄로처치", "unit" : "/", "numerator" : "화염강타로처치", "denominator" : "죽음", "description" : ""},
    ],
    "roadhog"   : [
        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "갈고리명중률", "unit" : "/", "numerator" : "갈고리로끌어오기", "denominator" : "갈고리시도", "description" : ""},
        { "label": "경기당환경요소로처치", "unit" : "/", "numerator" : "환경요소로처치", "denominator" : "치른게임", "description" : ""},
        { "label": "목숨당돼재앙으로처치", "unit" : "/", "numerator" : "돼재앙으로처치", "denominator" : "죽음", "description" : ""},
    ],
    "winston"   : [
        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당점프팩으로처치", "unit" : "/", "numerator" : "점프팩으로처치", "denominator" : "죽음", "description" : ""},
        { "label": "경기당환경요소로처치", "unit" : "/", "numerator" : "환경요소로처치", "denominator" : "치른게임", "description" : ""},
        { "label": "목숨당원시의분노로처치", "unit" : "/", "numerator" : "원시의분노로처치", "denominator" : "죽음", "description" : ""},
    ],
    "dva"       : [
        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당막은피해", "unit" : "/", "numerator" : "막은피해", "denominator" : "죽음", "description" : ""},
        { "label": "경기당막은피해", "unit" : "/", "numerator" : "막은피해", "denominator" : "치른게임", "description" : ""},

        { "label": "목숨당자폭으로처치", "unit" : "/", "numerator" : "자폭으로처치", "denominator" : "죽음", "description" : ""},
        { "label": "경기당자폭으로처치", "unit" : "/", "numerator" : "자폭으로처치", "denominator" : "치른게임", "description" : ""},
    ],
    "symmetra"  : [
        /* Per Death */
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당감시포탑으로처치", "unit" : "/", "numerator" : "감시포탑으로처치", "denominator" : "죽음", "description" : ""},
        
        { "label": "목숨당순간이동한플레이어", "unit" : "/", "numerator" : "순간이동한플레이어", "denominator" : "죽음", "description" : ""},
        { "label": "경기당순간이동한플레이어", "unit" : "/", "numerator" : "순간이동한플레이어", "denominator" : "치른게임", "description" : ""},

        { "label": "목숨당순간이동기가동시간", "unit" : "/", "numerator" : "순간이동기가동시간", "denominator" : "죽음", "description" : ""},
        { "label": "경기당순간이동기가동시간", "unit" : "/", "numerator" : "순간이동기가동시간", "denominator" : "치른게임", "description" : ""},
    ],
    "widowmaker": [
        /* Accuracy */

        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "저격명중률", "unit" : "/", "numerator" : "저격명중", "denominator" : "OVERWATCH.GUID.0X0860000000000217", "description" : ""},

        { "label": "목숨당맹독지뢰로처치", "unit" : "/", "numerator" : "맹독지뢰로처치", "denominator" : "죽음", "description" : ""},
        { "label": "경기당맹독지뢰로처치", "unit" : "/", "numerator" : "맹독지뢰로처치", "denominator" : "치른게임", "description" : ""},
    ],
    "tracer"    : [
        /* Accuracy */

        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당펄스폭탄으로처치", "unit" : "/", "numerator" : "펄스폭탄으로처치", "denominator" : "죽음", "description" : ""},
        { "label": "경기당펄스폭탄으로처치", "unit" : "/", "numerator" : "펄스폭탄으로처치", "denominator" : "치른게임", "description" : ""},
    ],
    "hanzo"     : [
        /* Accuracy */

        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당갈래화살로처치", "unit" : "/", "numerator" : "갈래화살로처치", "denominator" : "죽음", "description" : ""},
        { "label": "경기당갈래화살로처치", "unit" : "/", "numerator" : "갈래화살로처치", "denominator" : "치른게임", "description" : ""},

        { "label": "목숨당용의일격으로처치", "unit" : "/", "numerator" : "용의일격으로처치", "denominator" : "죽음", "description" : ""},
        { "label": "경기당용의일격으로처치", "unit" : "/", "numerator" : "용의일격으로처치", "denominator" : "치른게임", "description" : ""},
    ],
    "mercy"     : [
        /* Accuracy */

        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당치유량", "unit" : "/", "numerator" : "치유", "denominator" : "죽음", "description" : ""},
        { "label": "경기당치유량", "unit" : "/", "numerator" : "치유", "denominator" : "치른게임", "description" : ""},

        { "label": "목숨당부활한플레이어", "unit" : "/", "numerator" : "부활한플레이어", "denominator" : "죽음", "description" : ""},
        { "label": "경기당부활한플레이어", "unit" : "/", "numerator" : "부활한플레이어", "denominator" : "치른게임", "description" : ""},


    ],
    "zenyatta"  : [
        /* Accuracy */

        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당공격형도움", "unit" : "/", "numerator" : "공격형도움", "denominator" : "죽음", "description" : ""},
        { "label": "경기당공격형도움", "unit" : "/", "numerator" : "공격형도움", "denominator" : "치른게임", "description" : ""},
        
        { "label": "경기당방어형도움", "unit" : "/", "numerator" : "방어형도움", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당방어형도움", "unit" : "/", "numerator" : "방어형도움", "denominator" : "치른게임", "description" : ""},


        { "label": "경기당자가치유", "unit" : "/", "numerator" : "자가치유", "denominator" : "치른게임", "description" : ""},
        { "label": "목숨당자가치유", "unit" : "/", "numerator" : "자가치유", "denominator" : "치른게임", "description" : ""},

        { "label": "목숨당초월로치유", "unit" : "/", "numerator" : "초월로치유", "denominator" : "죽음", "description" : ""},
        { "label": "경기당초월로치유", "unit" : "/", "numerator" : "초월로치유", "denominator" : "치른게임", "description" : ""},
    ],
    "genji"     : [
        /* Accuracy */

        /* Per Death */
        { "label": "처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},
        // { "label": "목숨당폭주시간", "unit" : "/", "numerator" : "폭주시간", "denominator" : "죽음", "description" : ""},
        /* Speacial Skill */
        { "label": "목숨당튕겨낸피해", "unit" : "/", "numerator" : "튕겨낸피해", "denominator" : "치른게임", "description" : ""},
        { "label": "목숨당용검으로처치", "unit" : "/", "numerator" : "용검으로처치", "denominator" : "죽음", "description" : ""},
        
        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        /* Speacial Skill */
        { "label": "경기당튕겨낸피해", "unit" : "/", "numerator" : "튕겨낸피해", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당용검으로처치", "unit" : "/", "numerator" : "용검으로처치", "denominator" : "치른게임", "description" : ""},
        
    ], 
    "ana"       : [
        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당치유량", "unit" : "/", "numerator" : "치유", "denominator" : "죽음", "description" : ""},
        { "label": "경기당치유량", "unit" : "/", "numerator" : "치유", "denominator" : "치른게임", "description" : ""},

        { "label": "목숨당재운적", "unit" : "/", "numerator" : "치유", "denominator" : "죽음", "description" : ""},
        { "label": "경기당재운적", "unit" : "/", "numerator" : "치유", "denominator" : "치른게임", "description" : ""},

        { "label": "목숨당나노강화제도움", "unit" : "/", "numerator" : "나노강화제도움", "denominator" : "죽음", "description" : ""},
        { "label": "경기당나노강화제도움", "unit" : "/", "numerator" : "나노강화제도움", "denominator" : "치른게임", "description" : ""},
    ],
    "lucio"     : [
        /* Per Death */
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        // { "label": "경기당폭주시간",  "unit" : "/", "numerator" : "폭주시간", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당치명타",    "unit" : "/", "numerator" : "치명타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당치유량", "unit" : "/", "numerator" : "치유", "denominator" : "죽음", "description" : ""},
        { "label": "경기당치유량", "unit" : "/", "numerator" : "치유", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당환경요소로처치", "unit" : "/", "numerator" : "환경요소로처치", "denominator" : "치른게임", "description" : ""},
    ],
    "torbjoern" : [
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
    ],
    "junkrat"   : [
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
    ],
    "zarya"     : [
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
    ],
    "mei"       : [
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
    ],
    "sombra"    : [
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
    ],
    "doomfist"  : [
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당단독처치", "unit" : "/", "numerator" : "단독처치", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당피해량", "unit" : "/", "numerator" : "준모든피해", "denominator" : "죽음", "description" : ""},

        /* Per Game */
        { "label": "경기당결정타",    "unit" : "/", "numerator" : "결정타",   "denominator" : "치른게임", "description" : ""},
        { "label": "경기당단독처치",  "unit" : "/", "numerator" : "단독처치", "denominator" : "치른게임", "description" : ""},
        { "label": "경기당피해량",    "unit" : "/", "numerator" : "준모든피해",   "denominator" : "치른게임", "description" : ""},

        /* Speacial Skill */
        { "label": "목숨당기술로준피해", "unit" : "/", "numerator" : "기술로준피해", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당생성한보호막", "unit" : "/", "numerator" : "생성한 보호막", "denominator" : "죽음", "description" : ""},
        { "label": "목숨당파멸의일격으로처치", "unit" : "/", "numerator" : "파멸의 일격으로 처치", "denominator" : "죽음", "description" : ""},
    ],
    "orisa"     : [
        { "label": "목숨당처치", "unit" : "/", "numerator" : "처치", "denominator" : "죽음", "description" : ""},
    ],
}