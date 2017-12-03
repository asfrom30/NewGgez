'use strict';

import angular from 'angular';

/* v1 */
// import apiDuplicateBtns from './v1/api-duplicate-btns/api-duplicate-btns.service'
// import apiUserData from './v1/fetch-user-data/fetch-user-data.service';

/* v2 */
// /api/v1/users/?btn=냅둬라날
// /api/v1/users/?btg=냅둬라날#3934
// /api/v1/userdatas/:id/:date

// import UserDatasModule from './v2/user-datas/user-datas.module'
// import UsersModule from './v2/users/users.module';

/* For Sample */
import UserDatasModule from './sample/user-datas/api.user-datas.service';

/* v3 */
// import UserListModule from './v3/userlist/api.v3.userlist.service';
import StoredBtgsModule from './v3/stored-btgs/api.stored-btgs.service';
import PlayersIdApiModule from './v3/players/api.players.id.service';
import PlayersBtgApiModule from './v3/players/api.players.btg.service';
import PlayerDatasModule from './v3/player-datas/api.player-datas.service';
import TierDatasModule from './v3/tier-datas/api.tier.datas.service';

export default angular
    .module('ggez.core.api', [UserDatasModule, PlayersIdApiModule, PlayersBtgApiModule, PlayerDatasModule, TierDatasModule])
    .name;