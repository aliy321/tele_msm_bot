require('dotenv').config();
const express = require('express');
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
var http = require('http');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

const SkillNodes = require('./models/skills_nodes');
const BoostNodes = require('./models/boost_nodes');
const JewelsData = require('./models/jewel');
const SetEffectData = require('./models/set_effect');
const PbaData = require('./models/pba');
const LinkSkillData = require('./models/linkskill');
const userData = require('./models/users_model');
const LegionData = require('./models/legion');
const LongSpearData = require('./models/long_spear');
const imagesData = require('./models/images');
const statsCapData = require('./models/stats_cap');
const trioData = require('./models/trio');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to Msm Bot');
});

const dbURI = "mongodb+srv://msm-bot-user:aliyakhbar321@msmtelebot.asg5e.mongodb.net/msm-bot?retryWrites=true&w=majority";
mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => app.listen(PORT))
    .catch((err) => console.log(err))

// live app
const token = '1849291188:AAFAReTWpmKLcassRWo-uCTvlVl54wqIFHo';

// test api
// const token = '1915236290:AAFU6-RJPa1nHNC9BYx_adLmG3vPAbQW7Ck';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
    polling: true,
    filepath: false,
});

function startKeepAlive() {
    setInterval(function () {
        const host = 'http://msm-bot.herokuapp.com';

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
}

startKeepAlive();

// mongoose & mongo tests
app.get('/add-user', (req, res) => {
    const user = new userData({
        username: 'aliy akhbar',
        uid: '123123',
        isAdmin: 'no'
    })

    user.save()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/all-user', (req, res) => {
    userData.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/all-non-admin-user', (req, res) => {
    userData.find({
            'isAdmin': 'no'
        })
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});


// INSERT DATA
app.get('/add-trio', (req, res) => {
    const info = new trioData({
        "key": "merc",
        "name": "Mercedes",
        "skill": [{
                "skill": "Ishtar's Ring | Stunning Strike | Elemental Knights"
            },
            {
                "skill": "Holy Charge | Blizzard Charge | Fire Charge"
            }
        ]
    })

    info.save()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/all-trio', (req, res) => {
    trioData.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/all-pba', (req, res) => {
    var action = 'wa';
    var replace = "regex\\i";
    var re = new RegExp(action, "i");

    PbaData.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});






// ADMIN STUFF
bot.onText(/\/start/, (msg) => {
    const uid = msg.from.id;
    const userName = msg.from.username;
    const date = msg.date;

    // console.log(uid);

    userData.find({
            'uid': `${uid}`
        })
        .then(result => {
            // console.log(result);

            if (result.length > 0) {
                // console.log("welcome the user");

                const resp = 'Hi ' + `${userName}` + '! Im <b>Professor MSM</b>. Im here to provide you with Maplestory M resources on the go! \n\n<b>Press / to see available commands!</b> \n\nEnjoy.';

                bot.sendMessage(msg.chat.id, resp, {
                    parse_mode: 'HTML'
                });

            } else {
                // console.log("empty");

                const user = new userData({
                    username: userName,
                    uid: uid,
                    isAdmin: 'no'
                })

                user.save();

                const resp = 'Hi ' + `${userName}` + '! Im <b>Professor MSM</b>. Im here to provide you with Maplestory M resources on the go! \n\n<b>Press / to see available commands!</b> \n\nEnjoy.';

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
});

bot.onText(/\/getUsers/, (msg) => {
    console.log('getUsers');

    userData.find({
            'isAdmin': 'no'
        })
        .then(result => {
            var message = '';

            for (const results of result) {
                // console.log(results.username);
                message += '<b>@' + results.username + '</b> | ' + results.uid + '\n\n';
            }

            bot.sendMessage(msg.chat.id, message, {
                parse_mode: 'HTML'
            });
        })
        .catch(err => {
            console.log(err);
        });
});

// admin broadcast msg to all user
bot.onText(/\/admin_cast (.+)/, (msg, match) => {
    // console.log(match[1]);
    const resp = match['input'];
    console.log(resp);

    const filterResp = resp.replace('/admin_cast', '')
    console.log(filterResp);

    userData.find({
            'isAdmin': 'no'
        })
        .then(result => {
            var message = '';

            for (const results of result) {
                // console.log(results.username);
                const uid = results.uid;

                bot.sendMessage(uid, filterResp, {
                    parse_mode: 'Markdown'
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
});
// ADMIN STUFF

// Skill Node
bot.onText(/\/skillnode/, (msg) => {
    SkillNodes.find()
        .then(result => {
            // console.log(result);
            var message = '';

            for (const results of result) {
                // console.log(results.level);
                message += '<b>Level ' + results.level + '</b>\n<b>Need :</b> ' + results.need + '\n<b>To Max :</b> ' + results.max + '\n<b>Extract :</b> ' + results.shards + ' shards\n\n';
            }

            const resp = "<b> Skill Nodes</b> \n_ _ _ _ _ \n\n" + `${message}`;

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

// boost Node
bot.onText(/\/boostnode/, (msg) => {
    BoostNodes.find()
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

// legion
bot.onText(/\/legion/, (msg) => {
    LegionData.find()
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

// long spear
bot.onText(/\/spear/, (msg) => {
    LongSpearData.find()
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

    imagesData.find({
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
                        text: item.innerText,
                    });
                });

                return results[0];
            })

            const resp = "<b> Latest Patch Notes </b> \n_ _ _ _ _ \n\n" + `${list['url']}`;

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
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

// long spear
bot.onText(/\/statscap/, (msg) => {
    statsCapData.find()
        .then(result => {
            // console.log(result);
            var message = '';

            for (const results of result) {
                message += '<b>' + results.name + '</b> - ' + results.stats + '\n\n';
            }

            const resp = "<b> Stats Cap </b> \n_ _ _ _ _ \n\n" + `${message}`;

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

// PERFECT TRIO
bot.onText(/\/trio (.+)/, (msg, match) => {
    console.log('perfect trio');

    const capture = match[1].toLowerCase();
    // var replace = "regex\\i";
    // var re = new RegExp(capture, "i");

    let name = '';
    let i = 1;

    trioData.find({
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

const opt = [];
var callbackToQuery = "";

// JEWEL
bot.onText(/\/jewel/, function onEditableText(msg) {
    callbackToQuery = "Jewel";

    opt.length = 0;

    opt.push([{
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
    );

    const opts = {
        reply_markup: {
            inline_keyboard: opt
        }
    };

    bot.sendMessage(msg.from.id, 'Select an option', opts);
});

// SETEFFECT
bot.onText(/\/seteffect/, function onEditableText(msg) {
    callbackToQuery = "SetEffect";
    opt.length = 0

    opt.push([{
            text: 'Necro',
            callback_data: 'Necro'
        }], [{
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
    );

    const opts = {
        reply_markup: {
            inline_keyboard: opt
        }
    };
    bot.sendMessage(msg.from.id, 'Select an option', opts);
});

// PBA WEAP
bot.onText(/\/pba/, function onEditableText(msg) {
    callbackToQuery = "PBA";
    opt.length = 0

    opt.push([{
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
    );

    const opts = {
        reply_markup: {
            inline_keyboard: opt
        }
    };
    bot.sendMessage(msg.from.id, 'Select an option', opts);
});

// Linkskill
bot.onText(/\/linkskill/, function onEditableText(msg) {
    callbackToQuery = "LinkSkill";
    opt.length = 0

    opt.push([{
            text: 'Invincible Belief (DK, Hero, Pala)',
            callback_data: 'Invincible Belief'
        }],
        [{
            text: 'Thief Cunning (NL, Shad, DB)',
            callback_data: 'Thief Cunning'
        }],
        [{
            text: 'Spirit Of Freedom (Mech, WH, BaM)',
            callback_data: 'Spirit Of Freedom'
        }],
        [{
            text: 'Empirical Knowledge (Bsh, ILM, FP)',
            callback_data: 'Empirical Knowledge'
        }],
        [{
            text: 'Adventure Curiosity (BM, MM)',
            callback_data: 'Adventure Curiosity'
        }],
        [{
            text: 'Pirate Blessing (Corsair, Bucc)',
            callback_data: 'Pirate Blessing'
        }],
        [{
            text: 'Cygnus Blessing (DW, NW, WA, BW, TB)',
            callback_data: 'Cygnus Blessing'
        }],
        [{
            text: 'Offsensive Stats',
            callback_data: 'Offensive'
        }],
        [{
            text: 'Defensive Stats',
            callback_data: 'Defensive'
        }],
        [{
            text: 'Training Stats',
            callback_data: 'Training'
        }],
    );

    const opts = {
        reply_markup: {
            inline_keyboard: opt
        }
    };
    bot.sendMessage(msg.from.id, 'Select an option (Updated as of Angelic Buster Release)', opts);
});

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: {
            inline_keyboard: opt
        },
        parse_mode: 'HTML'
    };

    // console.log(opt);

    let message = '';

    if (callbackToQuery === "Jewel") {
        console.log('call back jewel');

        JewelsData.find({
                'name': `${action}`
            })
            .then(result => {
                // console.log(result);

                result.forEach(function (item, i) {
                    item.jewel.forEach(function (subItem, i) {
                        // console.log(subItem.rank);
                        message += '<b>' + subItem.rank + '</b>\n' + subItem.info + '\n\n';
                    });
                });

                const resp = '<b>' + `${action}` + "</b> \n_ _ _ _ _ \n\n" + `${message}`;

                bot.editMessageText(resp, opts);
            })
            .catch(err => {
                console.log(err);

                const resp = "Woopie Daisy! Try again later.";

                bot.sendMessage(msg.chat.id, resp, {
                    parse_mode: 'HTML'
                });
            });

    } else if (callbackToQuery === "SetEffect") {
        console.log('call back seteffect');

        SetEffectData.find({
                'name': `${action}`
            })
            .then(result => {
                // console.log(result);

                result.forEach(function (item, i) {
                    item.set.forEach(function (subItem, i) {
                        // console.log(subItem.rank);
                        message += '<b>' + subItem.set + '</b>\n' + subItem.info + '\n\n';
                    });
                });

                const resp = '<b>' + `${action}` + "</b> \n_ _ _ _ _ \n\n" + `${message}`;

                bot.editMessageText(resp, opts);
            })
            .catch(err => {
                console.log(err);

                const resp = "Woopie Daisy! Try again later.";

                bot.sendMessage(msg.chat.id, resp, {
                    parse_mode: 'HTML'
                });
            });
    } else if (callbackToQuery === "PBA") {
        console.log('call back PBA');

        PbaData.find({
                'name': `${action}`
            })
            .then(result => {
                // console.log(result);

                result.forEach(function (item, i) {
                    item.info.forEach(function (subItem, i) {
                        message += '<b>' + subItem.info_type + '</b>\n' + 'normal: ' + subItem.normal + '\ninno: ' + subItem.inno + '\nemblem: ' + subItem.emblem + '\n\n';
                    });
                });

                const resp = '<b>' + `${action}` + " PBA </b> \n_ _ _ _ _ \n\n" + `${message}`;

                bot.editMessageText(resp, opts);
            })
            .catch(err => {
                console.log(err);

                const resp = "Woopie Daisy! Try again later.";

                bot.sendMessage(msg.chat.id, resp, {
                    parse_mode: 'HTML'
                });
            });

    } else if (callbackToQuery === "LinkSkill") {
        console.log('call back linkskill');

        var replace = "regex\\i";
        var re = new RegExp(action, "i");
        // console.log(re);
        let name = '';

        LinkSkillData.find({
                name: re
            }, '')
            .then(result => {
                result.forEach(function (item, i) {
                    name = item.name;

                    item.skill.forEach(function (subItem, i) {
                        message += 'Level : ' + subItem.name + ' \n' + subItem.stats + '\n\n';
                    });
                });

                const resp = '<b>' + `${name}` + " </b> \n_ _ _ _ _ \n\n" + `${message}`;

                bot.editMessageText(resp, opts);
            })
            .catch(err => {
                console.log(err);

                const resp = "Woopie Daisy! Try again later.";

                bot.sendMessage(msg.chat.id, resp, {
                    parse_mode: 'HTML'
                });
            });

    }

});