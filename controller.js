const config = require('./config');
const crypto = require('crypto');
const axios = require('axios');

var fs = require('fs');
var fileName = 'token.txt';
var access_token = '';

var fetch = require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;

const routeUrl = "/dropbox";

module.exports.home = async (req, res, next) => {
    fs.readFile(fileName, (err, buf) => {
        if (!err) {
            access_token = (buf.toString());
            var queryPath = '';
            console.log(req.query);
            if (typeof req.query.path !== "undefined") {
                queryPath = '/' + req.query.path;
            }
            getPathList(queryPath).then((response) => {
                res.send(response);
            });
        } else {
            res.redirect('/dropbox/login');
        }
    });
}

module.exports.login = (req, res, next) => {
    let state = crypto.randomBytes(16).toString('hex');
    let dbxRedirect = config.DBX_OAUTH_DOMAIN +
        config.DBX_OAUTH_PATH +
        "?response_type=code&client_id=" + config.DBX_APP_KEY +
        "&redirect_uri=" + config.OAUTH_REDIRECT_URL +
        "&state=" + state;
    res.redirect(dbxRedirect);
}

module.exports.oauthredirect = async (req, res, next) => {
    if (req.query.error_description) {
        return next(new Error(req.query.error_description));
    }
    let state = req.query.state;

    if (req.query.code) {
        try {
            let axiosOptions = {
                url: config.DBX_API_DOMAIN + config.DBX_TOKEN_PATH,
                method: 'post',
                responseType: 'json',
                params: {
                    'code': req.query.code,
                    'grant_type': 'authorization_code',
                    'client_id': config.DBX_APP_KEY,
                    'client_secret': config.DBX_APP_SECRET,
                    'redirect_uri': config.OAUTH_REDIRECT_URL
                }

            }

            let response = await axios(axiosOptions);

            /* Response Format
            data:
                { access_token: 'string',
                token_type: 'string',
                uid: 'string',
                account_id: 'dbid:string' 
            } */

            var authorizedUserAccessToken = response.data.access_token;

            fs.writeFile('token.txt', authorizedUserAccessToken, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send('Cannot save token!')
                }
            });
            res.redirect("/dropbox");

        } catch (error) {
            return next(new Error('error getting token. ' + error.message));
        }
    }

}

function getPathList(path) {

    return new Promise((resolve, rejetc) => {
        var dbx = new Dropbox({
            fetch: fetch,
            accessToken: access_token
        });

        var html;
        var userDetails = dbx.usersGetCurrentAccount()
            .then((response) => {
                html = '<img src="' + response.profile_photo_url + '"></br> Hello ' + response.name.display_name + '!';
                html += '</br>e-mail : ' + response.email;
                dbx.filesListFolder({
                        path: path
                    })
                    .then((response) => {
                        var folderList = response.entries;
                        var totalFolders = folderList.length - 1;
                        for (var i = 0; i <= totalFolders; i++) {
                            var hrefUrl = encodeURIComponent(folderList[i].path_lower);
                            if (folderList[i][".tag"] == "folder")
                                var srcImage = 'http://www.iconhot.com/icon/png/hp-dock/512/folder-2-1.png';
                            else
                                var srcImage = 'http://icons.iconarchive.com/icons/graphicloads/long-shadow-documents/256/document-file-icon.png';
                            html += '</br><img src="' + srcImage + '" width="32px"> <strong><a href="' + routeUrl + '?path=' + hrefUrl + '">' + folderList[i].name + '</a></strong>';
                        }
                        resolve(html);
                    }).catch((error) => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            });
    });
}