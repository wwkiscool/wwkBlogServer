const db = require('../utils/mongodb')

const getUserInfo = async (ctx) => {
    const { userName,passWord} = ctx.request.body;
    const result = await db.find('users')
    console.log(result);
    
}

module.exports = {
    getUserInfo
}