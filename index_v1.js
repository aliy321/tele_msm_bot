require('dotenv').config();
const express = require('express');
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
var http = require('http'); //importing http

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to Msm Bot');
});

let jewelData = require('./json/jewel.json');
let pbaData = require('./json/weapon.json');
let armourSetEffectData = require('./json/armour.json');
let linkSkillsData = require('./json/linkskill.json');
let imagesData = require('./json/images.json');
let nodesData = require('./json/nodes.json');
let legionData = require('./json/legion.json');
let trioData = require('./json/perfect_trio.json');

// live app
// const token = '1849291188:AAFAReTWpmKLcassRWo-uCTvlVl54wqIFHo';

// test api
const token = '1915236290:AAFU6-RJPa1nHNC9BYx_adLmG3vPAbQW7Ck';

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
                console.log(res);
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

// all msg
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    // bot.sendMessage(chatId, 'Received your message');
});

// start msg
bot.onText(/\/start/, (msg) => {
    const resp = 'Hi! Im <b>Professor MSM</b>. Im here to provide you with Maplestory M resources on the go! \n\n<b>Press / to see available commands!</b> \n\nEnjoy.';

    bot.sendMessage(msg.chat.id, resp, {
        parse_mode: 'HTML'
    });
});

// JEWELS
bot.onText(/\/jewel (.+)/, (msg, match) => {
    console.log('jewel');

    const capture = match[1].toLowerCase();
    const jewel = jewelData.jewels;

    // console.log(jewel[0]);

    for (let i = 0; i < jewel.length; i++) {
        var loop = jewel[i][`${capture}`];

        if (loop) {
            var message = '';

            for (let i = 0; i < loop.length; i++) {
                message += '<b>' + loop[i]['rank'] + '</b>\n' + loop[i]['info'] + '\n\n';
            }

            const resp = '<b>' + `${capture.toUpperCase()}` + " JEWEL </b> \n_ _ _ _ _ \n\n" + `${message}`;
            // console.log(resp);

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        } else {
            const resp = "<code>Invalid Keyword.</code> \nPlease use either of this keywords below.. \n\nred, \nblue, \ngreen, \nyellow, \npurple ";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        }
    }
});

// JEWEL SET EFFECT
bot.onText(/\/jewelset (.+)/, (msg, match) => {
    console.log('jewel set effect');

    const capture = match[1].toLowerCase();
    const jewels_set = jewelData.jewels_set;

    for (let i = 0; i < jewels_set.length; i++) {
        var loop = jewels_set[i][`${capture}`];

        if (loop) {
            var message = '';

            for (let i = 0; i < loop.length; i++) {
                message += '<b>' + loop[i]['rank'] + '</b>\n' + loop[i]['info'] + '\n\n';
            }

            const resp = '<b>' + `${capture.toUpperCase()}` + " JEWEL SET EFFECT </b> \n_ _ _ _ _ \n\n" + `${message}`;
            // console.log(resp);

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        } else {
            const resp = "<code>Invalid Keyword.</code> \nPlease use either of this keywords below.. \n\nred, \nblue, \ngreen, \nyellow, \npurple ";

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        }
    }
});

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

    for (let i = 0; i < data.length; i++) {
        const loop = data[i][`${capture}`];

        if (typeof loop === 'undefined') {
            const resp = "<code>Invalid Keyword.</code> \nPlease use either of this keywords below.. \n\nangelic, \naran, \nfp, \nilm, \nbam, \nbsh, \nbw, \nbm, \nbucc, \ncorsair, \ndk, \ndw, \nda, \nds, \nevan, \nhero, \nkaiser, \nlumi, \nmech, \nnl, \nnw, \npala, \npath, \nphan, \nshade, \nshad, \ntb, \nwh, \nwa, \nxenon, \nkinesis, \nkanna, \ncannon";

            // console.log(resp);

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        } else {
            var message = '';
            const skill = loop[i]['trio'];
            const name = loop[i]['name'];

            for (let i = 0; i < skill.length; i++) {
                message += '<b>Perfect trio #' + [i + 1] + '</b>\n' + skill[i]['skill'] + '\n\n';
            }

            const resp = '<b>' + `${name}` + " Trio </b> \n_ _ _ _ _ \n\n" + `${message}`;
            // console.log(resp);

            bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'HTML'
            });
        }


    }
});

bot.on('polling_error', (error) => {
    console.log(error.code); // => 'EFATAL'
});

// TEST INLINE KEYBOARD
var jewel_opt = [];

jewel_opt.push([{
    text: '🟥',
    callback_data: 'red'
}],
[{
    text: '🟦',
    callback_data: 'blue'
}],
[{
    text: '🟩',
    callback_data: 'green'
}],
[{
    text: '🟨',
    callback_data: 'yellow'
}],
[{
    text: '🟪',
    callback_data: 'purple'
}]);

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