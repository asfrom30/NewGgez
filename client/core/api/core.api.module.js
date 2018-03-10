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

/* v3 */
// import UserListModule from './v3/userlist/api.v3.userlist.service';
import IndexInformation from './v3/index-information/api.index.information.service';

import PlayersApiModule from './v3/players/api.players.service';
import CrawlDatasModule from './v3/crawl-datas/api.crawl.datas.service';
import TierDatasModule from './v3/tier-datas/api.tier.datas.service';
import FavoritesApiModule from './v3/favorites/api.favorites.service';
import ThumbsApiModule from './v3/thumbs/api.thumbs.service';

import FreeboardApiModule from './v3/freeboard/freeboard.service.api.v3';
import UserApiModule from './v3/user/user.service.api.v3';


export default angular
    .module('ggez.core.api', [IndexInformation, PlayersApiModule, CrawlDatasModule, TierDatasModule, FavoritesApiModule, ThumbsApiModule, FreeboardApiModule
    , UserApiModule])
    .name;