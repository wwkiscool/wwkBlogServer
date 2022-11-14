const db = require('../db/config.ts')
let { responseInterface } =  require('../utils/index.ts')
const getArticleList = async (ctx) => {
    const { pageSize, pageNum, title, tag } = ctx.request.query;
    try {
        const res = await db.query(`select * from article`)
        responseInterface(res,ctx)
    } catch (error) {
        if(error) {
            responseInterface(error,ctx)
        }
    }
}

module.exports = {
    getArticleList
}