# Simple Dropbox API

Back end implementation, using an existing dropbox app and browse folder files.

## Getting Started

Download or clone the repo .

### Installing

Run the following to install all the necessery files.

```
npm install
```

Create a .env file on your root folder with the following format:

```
DBX_APP_KEY = YOUR APP KEY FROM DROPOBOX
DBX_APP_SECRET = YOU APP SECRET FROM DROPBOX
OAUTH_REDIRECT_URL = YOUR REDIRECT AUTHORIZATION URL FROM DROPBOX 
SESSION_ID_SECRET = A RAND SALT FOR SESSION
```
## Running 

After that execute it , with the following command
```
npm start
```

Open your browser and navigate to 
```
http://localhost:3000
```

Authorize your dropbox account and browse the app's filese

## Built With

* [dropbox JDK](https://www.npmjs.com/package/dropbox) Dropbox Javascript Framework
* [express](https://expressjs.com/) - Node.js web application framework
* [axios](https://github.com/axios/axios) - Promise base http requests

## Authors

* **Thomas Dolianidis** - *Idea Architect / Implementation * - [PurpleBooth](https://github.com/LiveEveryDay)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
