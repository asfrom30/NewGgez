# Now beta service is available
* [http://ggez.kr](http://ggez.kr)

# Snapshot and Screenshot
<table>
    <tbody>
        <tr>
            <td><img src="./.resources/index.gif" style="width:250px;"> </td>
            <td><img src="./.resources/overview.gif" style="width:250px;"> </td>
            <td><img src="./.resources/detail.gif" style="width:250px;"> </td>
        </tr>
        <tr>
            <td align="center"> index </td>
            <td align="center"> overview </td>
            <td align="center"> detail </td>
        </tr>
    </tbody>
<table>
<table>
    <tbody>
        <tr>
            <td><img src="./.resources/compare.gif" style="width:250px;"> </td>
            <td><img src="./.resources/favorite.gif" style="width:250px;"> </td>
        </tr>
        <tr>
            <td align="center"> compare </td>
            <td align="center"> favorite </td>
        </tr>
    </tbody>
<table>


# Technical Report
* 한국어로 된 기술문서를 보시려면 [여기로](./README_kr.md)
* Technical document in english link is [here](./README_en.md)

# Reamining Job
## Ux, Ui
* radarchart legend
* detail and compare page selectors hidden.(not toggling)
* table th align text
* need to add hero moira
* index page table and anchor collision
* in search bar loading bar bigger.
* ~~recent update time~~
* ~~table result strong and weaker span~~

## Bug-fix
* ~~hero torbjorn, bastion bug~~
* compare table score appear minus value
* webpack vendor hash value check(status ok but not cache use in browser)
* hero.detail.component can not get diff season data...
* random page random number must be based on cahce factory

## Technical
* Make rich component(`onloading` `onResultTrue` `onResultFalse`)
* drop old collections
* go last view(or mine) icon based on server session
* failed craw players when on cron job, set deprecated true.
* tier-data.json neede minify.
## Post Service
* Test and Refactoring
* i18n
* Ranking
    * main page ranking
    * hero page ranking

# Release Note
