const https = require('https');

var formatDate = (mark, flag) => {
    if (!mark) mark = '-'
    let year = new Date().getFullYear(); // 年
    let _month = new Date().getMonth() + 1; //月
    let month = _month >= 10 ? _month : '0' + _month;
    let _day = new Date().getDate(); // 日
    let day = _day >= 10 ? _day : '0' + _day;
    let _hours = new Date().getHours();
    let hours = _hours >= 10 ? _hours : '0' + _hours; // 小时
    let _min = new Date().getMinutes();
    let min = _min >= 10 ? _min : '0' + _min; // 分钟
    let _sec = new Date().getSeconds();
    let sec = _sec >= 10 ? _sec : '0' + _sec; // 秒
    let nowDate = flag ? `${year}${mark}${month}${mark}${day} ${hours}:${min}:${sec}` : `${year}${mark}${month}${mark}${day}`;
    return nowDate;
}
const chargeDataType = (val) => {
    // 判断数据类型
    let res = ''
    const type = Object.prototype.toString.call(val)
    switch (type) {
        case '[object Array]':
            res = 'array'
            break;
        case '[object Object]':
            res = 'object'
            break;
        case '[object Error]':
            res = 'error'
            break;
        case '[object String]':
            res = 'string'
            break;
        case '[object Null]':
            res = 'null'
            break;
        case '[object Date]':
            res = 'date'
            break;
        case '[object Date]':
            res = 'date'
            break;
        case '[object Function]':
            res = 'function'
            break;
        case '[object Number]':
            res = 'number'
            break;
        case '[object Boolean]':
            res = 'boolean'
            break;
        default:
            res = 'undefined'
            break;
    }

    return res

}
const responseInterface = (res, ctx) => {
    /**
     * @params res =>  数据库返回的数据 一般来说是数组
     */
    console.log("111111111111",chargeDataType(res) );
    
    if (chargeDataType(res) === 'error') {
        // 如果 错误的话
        ctx.body = {
            code: -1,
            data: [],
            error:res,
            message: '暂无数据'
        }
    } else {
        if (res.length === 0) {
            ctx.body = {
                code: 1,
                data: [],
                message: '暂无数据'
            }
        } else {
            ctx.body = {
                code: 1,
                message: 'success',
                data: res
            }
        }

    }
}


var ctxBody = (ctx, universial, params) => { //接口返回值
    /**
     * @param {*} ctx 路由第一个参数
     * @param {code:value,errMsg:""} universial 通用返回值
     * @param {*} params 接口需要返回的其他值 (例如列表查询的列表数据) 
     */
    if (!params) params = {}
    let res = Object.assign(params, universial)
    ctx.body = res
}


var selfHTTPS = (options) => { // 自定义请求第三方接口
    return new Promise((resolve, reject) => {
        let error, data = "";
        let req = https.get(options.url, (res) => {
            const { statusCode } = res;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            };
            if (error) {
                console.error(error.message);
                // 消费响应数据以释放内存
                res.resume();
                return;
            };
            res.setEncoding('utf-8');
            res.on('data', (chunk) => {
                console.log(chunk);
                if (chunk) {
                    data += chunk;
                } else {
                    reject("1")
                }

            });
            res.on("end", (e) => {
                console.log("e", e);
                resolve(JSON.parse(data));
            })
        });
        req.on("error", (e) => {
            reject(JSON.stringify(e))
        });
        req.end();
    })
}

module.exports = {
    formatDate,
    ctxBody,
    selfHTTPS,
    responseInterface
}