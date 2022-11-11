const db = require('../db/config.ts')
let { responseInterface } =  require('../utils/index.ts')
const getUserInfo = async (ctx) => {
    const { userName, passWord } = ctx.request.body;
    try {
        const res = await db.query(`select * from users`)
        responseInterface(res,ctx)
    } catch (error) {
        if(error) {
            responseInterface(error,ctx)
        }
    }
}

module.exports = {
    getUserInfo
}