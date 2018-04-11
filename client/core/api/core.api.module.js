'use strict';

import angular from 'angular';

import IndexInformationModule from './v3/index-information/api.index.information.service';
import PlayersModule from './v3/players/api.players.service';
import CrawlDatasModule from './v3/crawl-datas/api.crawl.datas.service';
import TierDatasModule from './v3/tier-datas/api.tier.datas.service';
import FavoritesModule from './v3/favorites/api.favorites.service';
import ThumbsModule from './v3/thumbs/api.thumbs.service';

import FreeboardModule from './v3/freeboard/freeboard.client.api.v3';
import UserModule from './v3/user/user.service.api.v3';


export default angular
    .module('ggez.core.api', [IndexInformationModule, PlayersModule, CrawlDatasModule, TierDatasModule, FavoritesModule, ThumbsModule, FreeboardModule
    , UserModule])
    .name;