const md5 = require('md5');
const Base64 = require('js-base64').Base64;
const axios = require('axios');
const moment = require('moment')

function randomCode(length) {
    const chars = ['0', "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    let result = ""
    for (let i = 0; i < length; i++) {
        let index = Math.ceil(Math.random() * 9);
        result += chars[index]
    }

    return result;
}

const sendCode = async (phone, code) => {
    let ACCOUNT_SID =
        '8a216da87ca23458017cb52b5e4a031c';
    let Rest_URL =
        'https://app.cloopen.com:8883'
    let AUTH_TOKEN = '768556295efe4c5699428b3e7878db47';
    let AppID = "8a216da87ca23458017cb52b5fbf0323";

    let sigParameter = "";
    let time = moment().format('YYYYMMDDHHmmss');
    sigParameter = md5(ACCOUNT_SID + AUTH_TOKEN + time);


    let url = `${Rest_URL}/2013-12-26/Accounts/${ACCOUNT_SID}/SMS/TemplateSMS?sig=${sigParameter}`;


    let Authorization = Base64.encode(ACCOUNT_SID + ':' + time);
    let data = {
        to: phone,
        appId: AppID,
        templateId: "1",
        datas: [code, "1"]
    }
    try {
        let res = await axios({
            url,
            method: "post",
            headers: {
                "Accept": "application/json",
                'Authorization': Authorization,
                "Content-Type": 'application/json;charset=utf-8'
            },
            data,
        });

        return res.data;
    } catch (error) {
        throw new Error(error)
    }



}

module.exports = {
    sendCode,
    randomCode
}