process.env.NTBA_FIX_319 = 1;

require('dotenv').config();
const express = require('express');
const request = require('request');
const http = require('http');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
var bodyParser = require('body-parser')

//-----------------------------------------
// MODELS
//-----------------------------------------

const userModel = require("./models/users_model");
const jewelModel = require("./models/jewel_model");
const skillNodesModel = require('./models/skills_nodes_model');
const boostNodesModel = require('./models/boost_nodes_model');
const setEffectModel = require('./models/set_effect_model');
const pbaModel = require('./models/pba_model');
const linkSkillModel = require('./models/linkskill_model');
const legionModel = require('./models/legion_model');
const longSpearModel = require('./models/long_spear_model');
const imagesModel = require('./models/images_model');
const statsCapModel = require('./models/stats_cap_model');
const trioModel = require('./models/trio_model');
const hyperModel = require('./models/hyper_model');
const flameModel = require('./models/flames_model');
const potentialModel = require('./models/potentials_model');

//-----------------------------------------
// ROUTERS
//-----------------------------------------

const PORT = process.env.PORT || 4000;
const app = express();
const router = (global.router = (express.Router()));

app.use('/jewel', require('./routes/jewel_api'));
app.use('/users', require('./routes/users_api'));
app.use('/linkskills', require('./routes/linkskill_api'));
app.use('/hypers', require('./routes/hyper_api'));
app.use('/stats_caps', require('./routes/stats_cap_api'));
app.use('/flames', require('./routes/flames_api'));
app.use('/potential', require('./routes/potential_api'));

app.use(express.json());
app.use(router);

//-----------------------------------------
// MOGO DB 
//-----------------------------------------

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const cluster = process.env.MONGO_CLUSTER;
const dbname = process.env.MONGO_DBNAME;

mongoose.connect(
    `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});

//-----------------------------------------
// Let bot stay awake constantly 
//-----------------------------------------

setInterval(function () {
    const host = process.env.HEROKU_APP_URL;

    http.get(host, function (res) {
        res.on('data', function (chunk) {
            // console.log(res);
            try {
                // optional logging... disable after it's working
                console.log("HEROKU RESPONSE: " + chunk);
            } catch (err) {
                console.log(err.message);
            }
        });
    }).on('error', function (err) {
        console.log("Error: " + err.message);
    });
}, 20 * 60 * 1000); // load every 20 minutes

//-----------------------------------------
// TELEGRAM 
//-----------------------------------------

// replace the value below with the Telegram token you receive from @BotFather
// const token = process.env.TELE_TOKEN_API_TEST;
const token = process.env.TELE_TOKEN_API;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
    polling: true
});

//-----------------------------------------
// Bot Commands 
//-----------------------------------------

// START
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const resp = 'Hi ' + `${msg.from.username}` + '! Im <b>Professor MSM</b>. Im here to provide you with Maplestory M resources on the go! \n\n<b>Press / to see available commands!</b> \n\nEnjoy.';

    userModel.findOne({
        uid: msg.from.id
    }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (!user) {
                console.log(user);
                const newUser = new userModel({
                    uid: msg.from.id,
                    username: msg.from.username,
                });

                newUser.save();
            } else {
                // update username
                userModel.findOneAndUpdate({
                    uid: msg.from.id
                }, {
                    username: msg.from.username
                }, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(user);
                    }
                });
            }
        }
    });

    bot.sendMessage(msg.chat.id, resp, {
        parse_mode: 'HTML'
    });
});

// GET ALL USERS
bot.onText(/\/getUsers/, async (msg) => {
    const chatId = msg.chat.id;
    const checkAdmin = await bot.getChatMember(chatId, msg.from.id);
    console.log(checkAdmin['user']['id']);

    if (checkAdmin['user']['id'] == '371956752') {
        console.log(checkAdmin);
        const users = await userModel.find({});

        try {
            // console.log(users);

            // convert users to string
            let usersString = '';
            let index = 1;

            users.forEach((user, index) => {
                // add total count of users
                usersString += `${index + 1}. @${user.username} | ${user.uid} \n`;
            });

            bot.sendMessage(msg.chat.id, usersString);
        } catch (err) {
            console.log(err);
        }
    }
});

// SKILL NODES
bot.onText(/\/skillnode/, (msg) => {
    skillNodesModel.find()
        .then(result => {
            // console.log(result);
            var message = '';

            for (const results of result) {
                message += '<b>Level ' + results.level + '</b>\n<b>Need :</b> ' + results.need + '\n<b>To Max :</b> ' + results.max + '\n<b>Extract :</b> ' + results.shards + ' shards\n\n';
            }

            const resp = "<b> Skill Node</b> \n_ _ _ _ _ \n\n" + `${message}`;

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        })
        .catch(err => {
            console.log(err);

            const resp = "Woopie Daisy! Try again later.";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        });
});

// BOOST NODE
bot.onText(/\/boostnode/, (msg) => {
    boostNodesModel.find()
        .then(result => {
            // console.log(result);
            var message = '';

            for (const results of result) {
                // console.log(results.level);
                message += '<b>Level ' + results.level + '</b>\n<b>Need :</b> ' + results.need + '\n<b>To Max :</b> ' + results.max + '\n<b>Extract :</b> ' + results.shards + ' shards\n\n';
            }

            const resp = "<b> Boost Nodes</b> \n_ _ _ _ _ \n\n" + `${message}`;

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        })
        .catch(err => {
            console.log(err);

            const resp = "Woopie Daisy! Try again later.";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        });
});

// LEGION
bot.onText(/\/legion/, (msg) => {
    legionModel.find()
        .then(result => {
            // console.log(result);
            var message = '';

            for (const results of result) {
                console.log(results);
                message += '<b>' + results.rank + '</b>\n<b>Require to level :</b> ' + results.level + '\n<b>Cumulative level :</b> ' + results.coin + '\n<b>Max Members :</b> ' + results.max + '\n\n';
            }

            const resp = "<b> Legion Cumulative Level </b> \n_ _ _ _ _ \n\n" + `${message}`;

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        })
        .catch(err => {
            console.log(err);

            const resp = "Woopie Daisy! Try again later.";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        });
});

// lONGINOUS SPEAR
bot.onText(/\/spear/, (msg) => {
    longSpearModel.find()
        .then(result => {
            // console.log(result);
            var message = '';

            for (const results of result) {
                console.log(results);
                message += '<b>Level :</b> ' + results.level + '\n<b>Unique :</b> ' + results.unique + '\n<b>Legend :</b> ' + results.legend + '\n<b>Mythic :</b> ' + results.mythic + '\n\n';
            }

            const resp = "<b> Longinus Spear </b> \n_ _ _ _ _ \n\n" + `${message}`;

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        })
        .catch(err => {
            console.log(err);

            const resp = "Woopie Daisy! Try again later.";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        });
});

// BUFFS
bot.onText(/\/buff/, (msg) => {
    console.log('buff');
    // console.log(msg);

    var replace = "regex\\i";
    var re = new RegExp('buff', "i");
    let data;

    imagesModel.find({
            name: re
        }, '')
        .then(result => {
            // console.log(result);

            for (const results of result) {
                data = results.url;
            }

            bot.sendPhoto(msg.chat.id, data, {
                caption: "Buff can be purchase from: \nCash Shop / TS / RA Shop / Mulung."
            });
        })
        .catch(err => {
            console.log(err);

            const resp = "Woopie Daisy! Try again later.";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        });
});

// PERFECT TRIO
bot.onText(/\/trio (.+)/, (msg, match) => {
    // console.log('perfect trio');

    const capture = match[1].toLowerCase();
    // var replace = "regex\\i";
    // var re = new RegExp(capture, "i");

    let name = '';
    let i = 1;

    trioModel.find({
            key: capture
        })
        .then(result => {
            // console.log(result);
            var message = '';

            if (result.length > 0) {
                result.forEach(function (item, i) {
                    name = item.name;

                    item.skill.forEach(function (subItem, index) {
                        i++;
                        message += '<b>Perfect Trio #' + i + '</b> - ' + subItem.skill + '\n\n';
                    });
                });

                const resp = "<b>" + `${name}` + " Trio</b> \n_ _ _ _ _ \n\n" + `${message}`;

                bot.sendMessage(msg.chat.id, resp, {
                    parse_mode: 'HTML'
                });
            } else {
                const resp = "<code>Invalid Keyword.</code> \nPlease use either of this keywords below.. \n\ab, \naran, \nfp, \nilm, \nbam, \nbsh, \nbw, \nbm, \nbucc, \ncor, \ndk, \ndw, \nda, \nds, \nevan, \nhero, \nkaiser, \nlumi, \nmech, \nnl, \nnw, \npala, \npath, \nphan, \nshade, \nshad, \ntb, \nwh, \nwa, \nxenon, \nkinesis, \nkanna, \ncannon, \nmerc, \ndb";

                bot.sendMessage(msg.chat.id, resp, {
                    parse_mode: 'HTML'
                });
            }
        })
        .catch(err => {
            console.log(err);

            const resp = "Woopie Daisy! Try again later.";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        });

    // console.log(search);
});

// STATS CAP
bot.onText(/\/statscap/, (msg) => {
    // console.log(msg);
    statsCapModel.find()
        .then(result => {
            // console.log(result);
            var message = '';

            for (const results of result) {
                // console.log(results);
                message += '<b>' + results.name + "</b>" + " : " + results.stats + '\n\n';
            }

            const resp = "<b> Stats Cap (Not confirmed by nexon)</b> \n_ _ _ _ _ \n\n" + `${message}`;

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        })
        .catch(err => {
            console.log(err);

            const resp = "Woopie Daisy! Try again later.";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        });
});

// PATCH NOTES
bot.onText(/\/patch/, (msg) => {
    try {
        (async () => {
            /** by default puppeteer launch method have headless option true*/
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });

            const page = await browser.newPage();
            const URL = "https://m.nexon.com/forum/board/1382";

            await page.goto(URL);

            const list = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('a.row');
                const link = "https://m.nexon.com";

                items.forEach((item) => {
                    results.push({
                        url: link + item.getAttribute('href'),
                        // text: item.innerText,
                    });
                });

                console.log(results);

                return results;
            })

            // get the first link url
            const url = list[0].url;
            // go to the link
            await page.goto(url);

            const content = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('div.thread-contents');

                items.forEach((item) => {
                    results.push({
                        // get img src
                        img: item.querySelector('img').getAttribute('src'),
                    });
                });

                return results;
            })

            const resp = `Latest patch notes [here](${list[0]['url']})`;

            // add image to resp
            bot.sendVideo(msg.chat.id, content[0].img, {
                caption: resp,
                parse_mode: 'MarkdownV2'
            });

            await browser.close();
        })()
    } catch (err) {
        const resp = "Woopie Daisy! Try again later.";

        bot.sendMessage(msg.chat.id, resp, {
            parse_mode: 'HTML'
        });
    }
});

//-----------------------------------------
// Bot Commands /W OPTIONS 
//-----------------------------------------

// JEWEL
bot.onText(/\/jewel/, async (msg) => {
    bot.removeListener("callback_query");
    
    const opt = [
        [{
                text: '🟥',
                callback_data: 'Red Jewel'
            },
            {
                text: '🟥🟥🟥🟥🟥',
                callback_data: 'Red Jewel Set'
            }
        ],
        [{
                text: '🟦',
                callback_data: 'Blue Jewel'
            },
            {
                text: '🟦🟦🟦🟦🟦',
                callback_data: 'Blue Jewel Set'
            }
        ],
        [{
                text: '🟩',
                callback_data: 'Green Jewel'
            },
            {
                text: '🟩🟩🟩🟩🟩',
                callback_data: 'Green Jewel Set'
            }
        ],
        [{
                text: '🟨',
                callback_data: 'Yellow Jewel'
            },
            {
                text: '🟨🟨🟨🟨🟨',
                callback_data: 'Yellow Jewel Set'
            }
        ],
        [{
                text: '🟪',
                callback_data: 'Purple Jewel'
            },
            {
                text: '🟪🟪🟪🟪🟪',
                callback_data: 'Purple Jewel Set'
            }
        ]
    ];

    await bot.sendMessage(msg.chat.id, "Select an option", {
        reply_markup: {
            inline_keyboard: opt,
        }
    });

    await bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        jewelModel.findOne({
            name: callbackQuery.data
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    // convert result to object
                    const resultObject = JSON.parse(JSON.stringify(result));
                    // console.log(resultObject.jewel);

                    // loop through result object
                    let jewelString = `${result.name}: \n\n`;

                    resultObject.jewel.forEach((jewel, index) => {
                        jewelString += `<b>${jewel.rank}</b> \n${jewel.info} \n\n`;
                    });

                    // update message
                    bot.editMessageText(jewelString, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                } else {
                    let message = 'Woopsie! Something went wrong. Please try again later.';

                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                }
            }
        });

    });
});

// SET EFFECT
bot.onText(/\/seteffect/, async (msg) => {
    bot.removeListener("callback_query");

    const opt = [
        [{
            text: 'Necro',
            callback_data: 'Necro'
        }],
        [{
            text: 'Fafnir',
            callback_data: 'Fafnir'
        }],
        [{
            text: 'Pensalir',
            callback_data: 'Pensalir'
        }],
        [{
            text: 'Empress',
            callback_data: 'Empress'
        }],
        [{
            text: 'Bloody',
            callback_data: 'Bloody'
        }],
        [{
            text: 'Eclectic',
            callback_data: 'Eclectic'
        }]
    ];

    await bot.sendMessage(msg.chat.id, "Select an option", {
        reply_markup: {
            inline_keyboard: opt,
        }
    });

    await bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        setEffectModel.findOne({
            name: callbackQuery.data
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    // console.log(result);

                    // convert result to object
                    const resultObject = JSON.parse(JSON.stringify(result));
                    // console.log(resultObject.jewel);

                    // loop through result object
                    let jewelString = `${result.name}: \n\n`;

                    resultObject.set.forEach((set, index) => {
                        jewelString += `<b>${set.set}</b> \n${set.info} \n\n`;
                    });

                    // update message
                    bot.editMessageText(jewelString, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                } else {
                    let message = 'Woopsie! Something went wrong. Please try again later.';

                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                }
            }
        });

    });
});

// PBA
bot.onText(/\/pba/, async (msg) => {
    bot.removeListener("callback_query");

    const opt = [
        [{
                text: 'Necro',
                callback_data: 'Necro'
            },
            {
                text: 'Ancient',
                callback_data: 'Ancient'
            }
        ],
        [{
                text: 'Mythic',
                callback_data: 'Mythic'
            },
            {
                text: 'Legend',
                callback_data: 'Legend'
            }
        ],
        [{
                text: 'Unique',
                callback_data: 'Unique'
            },
            {
                text: 'Epic',
                callback_data: 'Epic'
            }
        ],
        [{
                text: 'Rare',
                callback_data: 'Rare'
            },
            {
                text: 'Normal',
                callback_data: 'Normal'
            }
        ]
    ];

    await bot.sendMessage(msg.chat.id, "Select an option", {
        reply_markup: {
            inline_keyboard: opt,
        }
    });

    await bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        pbaModel.findOne({
            name: callbackQuery.data
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    // console.log(result);

                    // convert result to object
                    const resultObject = JSON.parse(JSON.stringify(result));
                    // console.log(resultObject.jewel);

                    // loop through result object
                    let jewelString = `${result.name}: \n\n`;

                    resultObject.info.forEach((data, index) => {
                        jewelString += '<b>' + data.info_type + '</b>\n' + 'normal: ' + data.normal + '\ninno: ' + data.inno + '\nemblem: ' + data.emblem + '\n\n';
                    });

                    // update message
                    bot.editMessageText(jewelString, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                } else {
                    let message = 'Woopsie! Something went wrong. Please try again later.';

                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                }
            }
        });

    });
});

// LINK SKILL
bot.onText(/\/linkskill/, async (msg) => {
    bot.removeListener("callback_query");

    const opt = [
        [{
                text: 'Invincible Belief',
                callback_data: 3
            },
            {
                text: 'Pirate Blessing',
                callback_data: 7
            },
            {
                text: 'Empirical Knowledge',
                callback_data: 6
            },
        ],
        [{
                text: 'Thief Cunning',
                callback_data: 8
            },
            {
                text: 'Adventurer Blessing',
                callback_data: 4
            },
            {
                text: 'Spirit of Freedom',
                callback_data: 5
            }
        ],
        [{
                text: 'Cygnus Blessing',
                callback_data: 9
            },
            // {
            //     text: '',
            //     callback_data: ''
            // },
            // {
            //     text: '',
            //     callback_data: ''
            // }
        ],
        [{
                text: 'Offsensive Stats',
                callback_data: 0
            },
            {
                text: 'Defensive Stats',
                callback_data: 1
            },
            {
                text: 'Training Stats',
                callback_data: 2
            }
        ]
    ];

    await bot.sendMessage(msg.chat.id, "Select an option", {
        reply_markup: {
            inline_keyboard: opt,
        }
    });

    await bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;
        // console.log(data);

        linkSkillModel.findOne({
            uid: data
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    // console.log(result);

                    // convert result to object
                    const resultObject = JSON.parse(JSON.stringify(result));
                    // console.log(resultObject.jewel);

                    // loop through result object
                    let message = `${result.name}: \n\n`;

                    resultObject.skill.forEach((data, index) => {
                        message += '<b>' + data.name + '</b> \n' + data.stats + '\n\n';
                    });

                    // update message
                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                } else {
                    let message = 'Woopsie! Something went wrong. Please try again later.';

                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                }
            }
        });

    });
});

// HYPER STATS
bot.onText(/\/hyper/, async (msg) => {
    bot.removeListener("callback_query");

    const opt = [
        [{
                text: 'Final Dmg %',
                callback_data: 0
            },
            {
                text: 'Max Dmg Inc',
                callback_data: 1
            },
            {
                text: 'Phy Dmg %',
                callback_data: 2
            },
        ],
        [{
                text: 'Mag Dmg %',
                callback_data: 3
            },
            {
                text: 'Crit Rate %',
                callback_data: 4
            },
            {
                text: 'Crit Dmg %',
                callback_data: 5
            }
        ],
        [{
                text: 'Boss Atk %',
                callback_data: 6
            },
            {
                text: 'Exp %',
                callback_data: 7
            },
            {
                text: 'SF Inc',
                callback_data: 8
            }
        ],
        [{
                text: 'Party Exp %',
                callback_data: 9
            },
            {
                text: 'KBK',
                callback_data: 10
            },
            {
                text: 'Fever Duration Inc',
                callback_data: 11
            }
        ],
        [{
                text: 'Item Buff Duration Inc',
                callback_data: 12
            },
            {
                text: 'Chance for Add. Dmg %',
                callback_data: 13
            },
            {
                text: 'Atk Ignore Rate %',
                callback_data: 14
            }
        ]
    ];

    await bot.sendMessage(msg.chat.id, "Select an option", {
        reply_markup: {
            inline_keyboard: opt,
        }
    });

    await bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        hyperModel.findOne({
            uid: data
        }, (err, result) => {
            if (err) {
                console.log(err);

            } else {
                if (result) {
                    // console.log(result);

                    // convert result to object
                    const resultObject = JSON.parse(JSON.stringify(result));
                    // console.log(resultObject.jewel);

                    // loop through result object
                    let message = `Description : ${result.description} \n\n`;

                    resultObject.info.forEach((data, index) => {
                        // message += '<b>' + data.level + '</b> \n' + data.info + '\n\n' + '<b>' + data.cost + '</b>';
                        message += '<b>' + data.level + '</b>\n' + result.name + " : " + data.info + '\nCost: ' + data.cost + '\n\n';

                    });

                    // update message
                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                } else {
                    let message = 'Woopsie! Something went wrong. Please try again later.';

                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                }
            }
        });
    });
});

// FLAMES
bot.onText(/\/flames/, async (msg) => {
    bot.removeListener("callback_query");

    const opt = [
        [{
                text: 'Epic',
                callback_data: 0
            },
            {
                text: 'Unique',
                callback_data: 1
            },
        ],
        [{
                text: 'Legend',
                callback_data: 2
            },
            {
                text: 'Mythic',
                callback_data: 3
            },
        ]
    ];

    await bot.sendMessage(msg.chat.id, "Select an option", {
        reply_markup: {
            inline_keyboard: opt,
        }
    });

    await bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;

        flameModel.findOne({
            uid: data
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    // console.log(result);

                    // convert result to object
                    const resultObject = JSON.parse(JSON.stringify(result));
                    // console.log(resultObject.jewel);

                    // loop through result object
                    let message = `Flames for : ${result.name} \n\n`;

                    resultObject.data.forEach((data, index) => {
                        message += '<b>' + data.name + '</b>\n' + data.stats + '\n\n';

                    });

                    // update message
                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                } else {
                    let message = 'Woopsie! Something went wrong. Please try again later.';

                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                }
            }
        });
    });
});

// POTENTIALS
bot.onText(/\/potential/, async (msg) => {
    bot.removeListener("callback_query");

    const opt = [
        [{
                text: 'Weapon',
                callback_data: 0
            },
            {
                text: 'Hat',
                callback_data: 1
            },
            {
                text: 'Outfit',
                callback_data: 2
            },
            {
                text: 'Gloves',
                callback_data: 3
            },
        ],
        [{
                text: 'Shoes',
                callback_data: 4
            },
            {
                text: 'Shoulder',
                callback_data: 5
            },
            {
                text: 'Belt',
                callback_data: 6
            },
            {
                text: 'Cape',
                callback_data: 7
            },
        ],
        [{
                text: 'Earing',
                callback_data: 8
            },
            {
                text: 'Necklace',
                callback_data: 9
            },
            {
                text: 'Ring',
                callback_data: 10
            },
            {
                text: 'Hearts',
                callback_data: 11
            },
            {
                text: 'Pocket',
                callback_data: 12
            },
        ]
    ];

    bot.sendMessage(msg.chat.id, "Select an option", {
        reply_markup: {
            inline_keyboard: opt,
        }
    });

    await bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const data = callbackQuery.data;
        
        potentialModel.findOne({
            uid: data
        }, async (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    // console.log(result);

                    // convert result to object
                    const resultObject = JSON.parse(JSON.stringify(result));
                    // console.log(resultObject.jewel);

                    // loop through result object
                    let message = `Potential for : ${result.name} \n\n`;

                    resultObject.data.forEach((data, index) => {
                        message += '<b>' + data.name + '</b>\n' + "Epic: " + data.epic + '\n' + "Unique: " + data.unique + '\n' + "Legend: " + data.legend + '\n\n';
                    });

                    // update message
                   await bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                } else {
                    let message = 'Woopsie! Something went wrong. Please try again later.';

                    bot.editMessageText(message, {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: {
                            inline_keyboard: opt,
                        },
                        parse_mode: 'HTML'
                    });
                }
            }
        });
    });
});