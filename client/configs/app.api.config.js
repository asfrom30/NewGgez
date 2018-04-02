

// FIXME: should be moved in const/settings(need to refactor)
const port = 9003;

module.exports = {

    // FIXME: fix base uri. api-dummies folder is moved in assets folder at 20180310 for refactoring
    baseUri : `http://localhost:${port}/core/api-dummies/v3`,
    dummie : {
        prefixUri : ''// not yet declared
    }
}