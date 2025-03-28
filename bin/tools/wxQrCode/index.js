const axios = require('axios');
const fs = require('fs');

// 微信小程序配置
const appId = 'wx2136507d5f2b2137'; // 替换为你的小程序AppID
const appSecret = 'fdae402c3984ed8cc1d6ee62ce2b55c7'; // 替换为你的小程序AppSecret

// 获取access_token
async function getAccessToken() {
    const response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
            grant_type: 'client_credential',
            appid: appId,
            secret: appSecret
        }
    });
    if (response.data.access_token) {
        return response.data.access_token;
    } else {
        throw new Error('Failed to get access_token: ' + JSON.stringify(response.data));
    }
}

// 生成小程序码
async function createUnlimitedQRCode(scene, path, width = 430, autoColor = false, lineColor = { r: '0', g: '0', b: '0' }, isHyaline = false) {
    const accessToken = await getAccessToken();
    const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
    // const url = `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${accessToken}`

    const data = {
        scene: 'TEST001', // 动态参数，用于区分不同的二维码
        //  path, // 小程序页面路径
        width: width, // 二维码宽度
        "check_path": true,
        "env_version": "trial"
        // auto_color: autoColor, // 是否自动配置线条颜色
        // line_color: lineColor, // 自定义线条颜色
        // is_hyaline: isHyaline // 是否生成透明底色
    };

    try {
        const response = await axios.post(url, data, {
            responseType: 'arraybuffer' // 返回图片二进制数据
        });

        // 将生成的二维码保存到本地
        const imagePath = `qrcode2.png`;
        fs.writeFileSync(imagePath, response.data);
        console.log(`小程序码已生成并保存到 ${imagePath}`);
    } catch (error) {
        console.error('生成小程序码失败：', error.response.data);
    }
}

// 调用示例
const scene = 'id=TEST001'; // 动态参数，可以根据需要修改
const path = 'pages/index/index'; // 小程序页面路径
const width = 430; // 二维码宽度

createUnlimitedQRCode(scene, path, width);