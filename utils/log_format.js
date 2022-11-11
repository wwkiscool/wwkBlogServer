
const log4js = require('log4js');

// const { LOG_CONFIG } = require('./config'); //加载配置文件

const CONFIG = {
    "API_PREFIX": "/api", // 配置了路由前缀
    "LOG_CONFIG":{
        "appenders": {
            "error": {
                "category": "errorLogger",      // logger 名称
                "type": "dateFile",             // 日志类型为 dateFile
                "filename": "logs/error/error", // 日志输出位置
                "alwaysIncludePattern": true,   // 是否总是有后缀名
                "pattern": "yyyy-MM-dd.log"  // 后缀，每小时创建一个新的日志文件
            },
            "response": {
                "category": "resLogger",
                "type": "dateFile",
                "filename": "logs/response/response",
                "alwaysIncludePattern": true,
                "pattern": "yyyy-MM-dd.log"
            }
        },
        "categories": {
            "error": {
                "appenders": ["error"],         // 指定日志被追加到 error 的 appenders 里面
                "level": "error"                // 等级大于 error 的日志才会写入
            },
            "response": {
                "appenders": ["response"],
                "level": "info"
            },
            "default": {
                "appenders": ["response"],
                "level": "info"
            }
        }
    }
};
log4js.configure(CONFIG.LOG_CONFIG);

let logFormat = {};

// 分别获取到 categories 里面的 error 和 response 元素
// 目的是为了输出错误日志和响应日志
let errorLogger = log4js.getLogger('error');
let resLogger = log4js.getLogger('response');

//封装错误日志
logFormat.error = (ctx, error, resTime) => {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

//封装响应日志
logFormat.response = (ctx, resTime) => {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};

//格式化响应日志
const formatRes = (ctx, resTime) => {
    let responserLog = formatReqLog(ctx.request, resTime); // 添加请求日志
    responserLog.push(`response status: ${ctx.status}`); // 响应状态码
    responserLog.push(`response body: \n${JSON.stringify(ctx.body)}`); // 响应内容
    responserLog.push(`------------------------ end\n`); // 响应日志结束
    return responserLog.join("\n");
};

//格式化错误日志
const formatError = (ctx, err, resTime) => {
    let errorLog = formatReqLog(ctx.request, resTime); // 添加请求日志
    errorLog.push(`err name: ${err.name}`); // 错误名称
    errorLog.push(`err message: ${err.message}`); // 错误信息
    errorLog.push(`err stack: ${err.stack}`); // 错误详情
    errorLog.push(`------------------------ end\n`); // 错误信息结束
    return errorLog.join("\n");
};

// 格式化请求日志
const formatReqLog = (req, resTime) => {
    let method = req.method;
    // 访问方法 请求原始地址 客户端ip
    let formatLog = [`\n------------------------ ${method} ${req.originalUrl}`, `request client ip: ${req.ip}`];

    if (method === 'GET') { // 请求参数
        formatLog.push(`request query: ${JSON.stringify(req.query)}\n`)
    } else {
        formatLog.push(`request body: ${JSON.stringify(req.body)}\n`)
    }

    formatLog.push(`response time: ${resTime}`); // 服务器响应时间
    return formatLog;
};

module.exports = logFormat;