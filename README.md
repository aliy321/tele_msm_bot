# MSM TELE BOT

MSM Resources information on telegram.

[Node.js Telegram Bot API](https://github.com/yagop/node-telegram-bot-api)

[MongoDB Atlas](https://www.mongodb.com/)

[Heroku](https://dashboard.heroku.com/)

## Installation

Clone repo and install.

```bash
npm install
```
Run locally
```bash
npm run dev
```


## Usage
Include models to use express api for CRUD
```
const potentialModel = require('./models/potentials_model');
```
Include routes too
```
app.use('/potential', require('./routes/potential_api'));
```


## Deploy
Login to heroku
```bash
$ heroku login
```

Clone the repository
```bash
$ heroku git:clone -a <heroku-repo-name>
$ cd <heroku-repo-folder>
```


Deploy your changes
```bash
$ git add .
$ git commit -am "make it better"
$ git push heroku master
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
 
Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)