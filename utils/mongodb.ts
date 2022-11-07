const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient
const ObjectID = MongoDB.ObjectID
const url = 'mongodb://root:xuwu666!@139.196.56.93:27017/wwkblog?authSource=admin'

class DB {
    dbClient: string
    static instance: any

    constructor() {
        this.dbClient = ''
        this.connect()
    }
    static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB()
        }
        return DB.instance
    }
    // 连接数据库
    connect() {
        let that = this;
        return new Promise((resolve, reject) => {
            //  解决数据库多次连接的问题
            if (!that.dbClient) {
                MongoClient.connect(url, (err, db) => {
                    if (err) {
                        reject(err)
                    } else {
                        that.dbClient = db;
                        resolve(that.dbClient)
                    }
                })
            } else {
                resolve(that.dbClient);
            }
        })
    }
    // 查找方法
    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db:any) => {
                var result = db.collection(collectionName).find(json);
                result.toArray(function (err, doc) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(doc);
                })

            })
        })
    }
    // 更新方法
    update(collectionName, oldJson, newJson) {
        return new Promise((resolve, reject) => {
            this.connect().then((db:any) => {
                db.collection(collectionName).updateOne(oldJson, {
                    $set: newJson
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    // 插入数据
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db:any) => {
                db.collection(collectionName).insertOne(json, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    // 删除数据
    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db:any) => {
                db.collection(collectionName).removeOne(json, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    // mongodb里面查询_id需要把字符串转换成对象
    getObjectId(id) {
        return new ObjectID(id);
    }
}

module.exports = DB.getInstance()