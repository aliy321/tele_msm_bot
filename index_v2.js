require('dotenv').config();
const express = require('express');
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
var http = require('http'); //importing http

const app = express();
const PORT = process.env.PORT || 5000;

const Datastore = require('nedb');

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to Msm Bot');
});

const dbURI = "mongodb+srv://msm-bot-user:aliyakhbar321@msmtelebot.asg5e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


let jewelData = require('./json/jewel.json');
let pbaData = require('./json/weapon.json');
let armourSetEffectData = require('./json/armour.json');
let linkSkillsData = require('./json/linkskill.json');
let imagesData = require('./json/images.json');
let nodesData = require('./json/nodes.json');
let legionData = require('./json/legion.json');
let trioData = require('./json/perfect_trio.json');
let spearData = require('./json/spear.json');
let statscapData = require('./json/stats_cap.json');

const database = new Datastore('database.db');
database.loadDatabase();

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

// // start msg
// bot.onText(/\/start/, (msg) => {
//     const resp = 'Hi! Im <b>Professor MSM</b>. Im here to provide you with Maplestory M resources on the go! \n\n<b>Press / to see available commands!</b> \n\nEnjoy.';

//     bot.sendMessage(msg.chat.id, resp, {
//         parse_mode: 'HTML'
//     });
// });

// start msg
bot.onText(/\/start/, (msg) => {
    // console.log(msg);
    const uid = msg.from.id;
    const userName = msg.from.username;
    const date = msg.date;

    // console.log(uid, userName, date);

    const resp = 'Hi! Im <b>Professor MSM</b>. Im here to provide you with Maplestory M resources on the go! \n\n<b>Press / to see available commands!</b> \n\nEnjoy.';

    var doc = {
        userName: msg.from.username,
        uid: msg.from.id,
        today: msg.from.date,
        isAdmin: 'isNotAdminr'
    };

    database.find({
        userName: userName
    }, function (err, docs) {
        // console.log(err);
        // console.log(docs);

        if (docs.length > 0) {
            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        } else {
            database.insert(doc, function (err, newDoc) {
                console.log(newDoc);
                console.log('new user added');
                
                bot.sendMessage(msg.chat.id, resp, {
                    parse_mode: 'HTML'
                });
            });

        }
    });
});

/////////////////
// ADMIN STUFF //
/////////////////

// admin find user
bot.onText(/\/admin_find (.+)/, (msg, match) => {
    console.log('find');

    const capture = match[1];
    console.log(capture);

    database.find({
        isAdmin: capture
    }, function (err, docs) {
        console.log(docs);


        var message = '';

        for (let i = 0; i < docs.length; i++) {
            message += '<b>@' + docs[i]['userName'] + '</b> | ' + docs[i]['uid'] + '\n\n';
        }

        bot.sendMessage(msg.chat.id, message, {
            parse_mode: 'HTML'
        });
    })
});

// admin broadcast msg to all user
bot.onText(/\/admin_cast (.+)/, (msg, match) => {
    // console.log(match[1]);
    const resp = match['input'];
    console.log(resp);

    const filterResp = resp.replace('/admin_cast', '')
    console.log(filterResp);

    database.find({
        isAdmin: 'isNotAdmin'
    }, function (err, docs) {
        console.log(docs);

        for (let i = 0; i < docs.length; i++) {
            const uid = docs[i]['uid'];

            bot.sendMessage(uid, filterResp, {
                parse_mode: 'Markdown'
            });
        }
    })
});

// admin broadcast msg to all user
bot.onText(/\/admin_cast_test (.+)/, (msg, match) => {
    // console.log(match[1]);
    const resp = match['input'];
    console.log(resp);

    const filterResp = resp.replace('/admin_cast_test', '')
    console.log(filterResp);

    database.find({
        isAdmin: 'isNotAdmin'
    }, function (err, docs) {
        // console.log(docs);

        bot.sendMessage(msg.chat.id, filterResp, {
            parse_mode: 'Markdown'
        });
    })
});

/////////////////
// ADMIN STUFF //
/////////////////


///////////////
// COMMANDS //
//////////////

// WEAPON PBA
bot.onText(/\/pba (.+)/, (msg, match) => {
    console.log('weapon pba');

    const capture = match[1].toLowerCase();
    const pba = pbaData.pba;
    // console.log(pba);

    for (let i = 0; i < pba.length; i++) {
        var loop = pba[i][`${capture}`];

        if (loop) {
            var message = '';

            for (let i = 0; i < loop.length; i++) {
                message += '<b>' + loop[i]['type'] + '</b>\n' + 'normal: ' + loop[i]['normal'] + '\ninno: ' + loop[i]['inno'] + '\nemblem: ' + loop[i]['emblem'] + '\n\n';
            }

            const resp = '<b>' + `${capture.toUpperCase()}` + " PBA </b> \n_ _ _ _ _ \n\n" + `${message}`;
            // console.log(resp);

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        } else {
            const resp = "<code>Invalid Keyword.</code> \nPlease use either of this keywords below.. \n\nnecro, \nancient, \nmythic, \nlegend, \nunique, \nepic, \nrare, \nnormal ";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        }
    }
});

// ARMOUR SET EFFECT
bot.onText(/\/seteffect (.+)/, (msg, match) => {
    console.log('armour set effect');

    const capture = match[1].toLowerCase();
    const setEffect = armourSetEffectData.setEffect;
    // console.log(setEffect);

    for (let i = 0; i < setEffect.length; i++) {
        var loop = setEffect[i][`${capture}`];

        if (loop) {
            var message = '';

            for (let i = 0; i < loop.length; i++) {
                message += '<b>' + loop[i]['type'] + '</b>\n' + loop[i]['effect'] + '\n\n';
            }

            const resp = '<b>' + `${capture.toUpperCase()}` + " SET EFFECT </b> \n_ _ _ _ _ \n\n" + `${message}`;
            // console.log(resp);

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        } else {
            const resp = "<code>Invalid Keyword.</code> \nPlease use either of this keywords below.. \n\nnecro, \nempress, \npensalir, \nmuspell, \nbloody, \neclectic,\nfafnir ";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        }
    }
});

// LINK SKILLS
bot.onText(/\/linkskills/, (msg) => {
    console.log('link skills');

    const linkskills = linkSkillsData;
    // console.log(linkskills);

    for (let i = 0; i < linkskills.length; i++) {
        var loop = linkskills[i];
        var title = loop['name'];
        var skill = loop['skill'];

        var message = '';

        for (let i = 0; i < skill.length; i++) {
            message += 'Level : ' + skill[i]['level'] + ' \n' + skill[i]['stats'] + '\n\n';
        }

        const resp = '<b>' + `${title}` + "</b> \n_ _ _ _ _ \n\n" + `${message}`;
        // console.log(resp);

        bot.sendMessage(msg.chat.id, resp, {
            parse_mode: 'HTML'
        });
    }
});

// BUFFS
bot.onText(/\/buff/, (msg) => {
    console.log('buff');
    // console.log(msg);

    const data = imagesData.images.buff.url;
    // console.log(data);

    // bot.sendPhoto(msg.chat.id, data);
    bot.sendPhoto(msg.chat.id, data, {
        caption: "Buff can be purchase from: \nCash Shop / TS / RA Shop / Mulung."
    });
});

// skill node
bot.onText(/\/skillnode/, (msg) => {
    console.log('skill node');
    const data = nodesData.nodes['skill'];

    // console.log(data);

    var message = '';

    for (let i = 0; i < data.length; i++) {
        message += '<b>Level ' + data[i]['level'] + '</b>\n<b>Need :</b> ' + data[i]['need'] + '\n<b>To Max :</b> ' + data[i]['max'] + '\n<b>Extract :</b> ' + data[i]['shards'] + ' shards\n\n';
    }

    const resp = "<b> Skill Nodes</b> \n_ _ _ _ _ \n\n" + `${message}`;
    // console.log(resp);
    // console.log(message);

    bot.sendMessage(msg.chat.id, resp, {
        parse_mode: 'HTML'
    });
});

// boost node
bot.onText(/\/boostnode/, (msg) => {
    console.log('boost node');
    const data = nodesData.nodes['boost'];

    // console.log(data);

    var message = '';

    for (let i = 0; i < data.length; i++) {
        message += '<b>Level ' + data[i]['level'] + '</b>\n<b>Need :</b> ' + data[i]['need'] + '\n<b>To Max :</b> ' + data[i]['max'] + '\n<b>Extract :</b> ' + data[i]['shards'] + ' shards\n\n';
    }

    const resp = "<b> Boost Nodes</b> \n_ _ _ _ _ \n\n" + `${message}`;
    // console.log(resp);
    // console.log(message);

    bot.sendMessage(msg.chat.id, resp, {
        parse_mode: 'HTML'
    });
});

// legion
bot.onText(/\/legion/, (msg) => {
    console.log('legion');
    const data = legionData.legion;

    // console.log(data);

    var message = '';

    for (let i = 0; i < data.length; i++) {
        message += '<b>' + data[i]['rank'] + '</b>\n<b>Require to level :</b> ' + data[i]['level'] + '\n<b>Cumulative level :</b> ' + data[i]['coin'] + '\n<b>Max Members :</b> ' + data[i]['max'] + '\n\n';
    }

    const resp = "<b> Legion Cumulative Level </b> \n_ _ _ _ _ \n\n" + `${message}`;
    // console.log(resp);
    // console.log(message);

    bot.sendMessage(msg.chat.id, resp, {
        parse_mode: 'HTML'
    });
});

// PERFECT TRIO
bot.onText(/\/trio (.+)/, (msg, match) => {
    console.log('perfect trio');

    const capture = match[1].toLowerCase();
    const data = trioData;

    const search = data.find((item) => {
        return item.key == capture;
    });

    if (search) {
        console.log(search);

        var message = '';
        const skill = search['skill'];
        const name = search['name'];

        for (let i = 0; i < skill.length; i++) {
            message += '<b>Perfect trio #' + [i + 1] + '</b>\n' + skill[i]['skill'] + '\n\n';
        }

        const resp = '<b>' + `${name}` + " Trio </b> \n_ _ _ _ _ \n\n" + `${message}`;
        console.log(resp);

        bot.sendMessage(msg.chat.id, resp, {
            parse_mode: 'HTML'
        });
    } else {
        console.log('meh');
        const resp = "<code>Invalid Keyword.</code> \nPlease use either of this keywords below.. \n\nangelic, \naran, \nfp, \nilm, \nbam, \nbsh, \nbw, \nbm, \nbucc, \ncorsair, \ndk, \ndw, \nda, \nds, \nevan, \nhero, \nkaiser, \nlumi, \nmech, \nnl, \nnw, \npala, \npath, \nphan, \nshade, \nshad, \ntb, \nwh, \nwa, \nxenon, \nkinesis, \nkanna, \ncannon";

        bot.sendMessage(msg.chat.id, resp, {
            parse_mode: 'HTML'
        });
    }

    // console.log(search);
});

bot.on('polling_error', (error) => {
    console.log(error.code); // => 'EFATAL'
});

// Jewel
var jewel_opt = [];

jewel_opt.push([{
        text: '🟥',
        callback_data: 'red'
    }], [{
        text: '🟥🟥🟥🟥🟥',
        callback_data: 'red_set'
    }],
    [{
        text: '🟦',
        callback_data: 'blue'
    }],
    [{
        text: '🟦🟦🟦🟦🟦',
        callback_data: 'blue_set'
    }],
    [{
        text: '🟩',
        callback_data: 'green'
    }],
    [{
        text: '🟩🟩🟩🟩🟩',
        callback_data: 'green'
    }],
    [{
        text: '🟨',
        callback_data: 'yellow'
    }],
    [{
        text: '🟨🟨🟨🟨🟨',
        callback_data: 'yellow_set'
    }],
    [{
        text: '🟪',
        callback_data: 'purple'
    }],
    [{
        text: '🟪🟪🟪🟪🟪',
        callback_data: 'purple_set'
    }]
);

bot.onText(/\/jewel/, (msg) => {
    console.log('jewel');

    const chatId = msg.chat.id;

    // bot.sendMessage(chatId, "Choose an Jewel", jewel_opt);
    bot.sendMessage(chatId, "Choose a color", {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: jewel_opt
        }
    });
});

bot.on('callback_query', function (message) {
    const text = message.data;
    const chatId = message.message.chat.id;
    const jewel = jewelData.jewels;

    console.log(message);

    for (let i = 0; i < jewel.length; i++) {
        // var loop = jewel[i][`${text}`];
        const jewelArr = jewel[i][text][i]['jewel'];
        const jewelName = jewel[i][text][i]['name'];

        var dataText = '';

        // console.log(jewelArr);

        for (let i = 0; i < jewelArr.length; i++) {
            dataText += '<b>' + jewelArr[i]['rank'] + '</b>\n' + jewelArr[i]['info'] + '\n\n';
        }

        const resp = '<b>' + `${jewelName}` + "</b> \n_ _ _ _ _ \n\n" + `${dataText}`;
        // console.log(resp);

        bot.sendMessage(chatId, resp, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: jewel_opt
            }
        });

    }
});

// spear
bot.onText(/\/spear/, (msg) => {
    console.log('spear');
    const data = spearData;

    // console.log(data);

    var message = '';

    for (let i = 0; i < data.length; i++) {
        message += '<b>Level :</b> ' + data[i]['level'] + '\n<b>Unique :</b> ' + data[i]['unique'] + '\n<b>Legend :</b> ' + data[i]['legend'] + '\n<b>Mythic :</b> ' + data[i]['mythic'] + '\n\n';
    }

    const resp = "<b> Longinus Spear </b> \n_ _ _ _ _ \n\n" + `${message}`;
    // console.log(resp);
    // console.log(message);

    bot.sendMessage(msg.chat.id, resp, {
        parse_mode: 'HTML'
    });
});

// stats cap
bot.onText(/\/statscap/, (msg) => {
    console.log('stats cap');
    const data = statscapData;

    // console.log(data);

    var message = '';

    for (let i = 0; i < data.length; i++) {
        message += '<b>' + data[i]['name'] + '</b> - ' + data[i]['stats'] + '\n\n';
    }

    const resp = "<b> Stats Cap </b> \n_ _ _ _ _ \n\n" + `${message}`;
    // console.log(resp);
    // console.log(message);

    bot.sendMessage(msg.chat.id, resp, {
        parse_mode: 'HTML'
    });
});

// TESTING STUFF

// const linkskills = linkSkillsData[0];
// console.log(linkskills);

// const linkskills = linkSkillsData;

// for (let i = 0; i < linkskills.length; i++) {
//     var loop = linkskills[i];
//     var title = linkskills[i]['name'];
//     var skill = linkskills[i]['skill'];

//     console.log(skill);
// }

app.listen(PORT);