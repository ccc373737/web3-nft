const { MongoClient } = require("mongodb");

const uri = "mongodb://admin:admin123@43.142.34.153:27017/";
const client = new MongoClient(uri);

const DB = "market";
const COLLECTION = "token";

exports.insertOrUpdate = async function insertOrUpdate(tokenAddress, tokenId, param) {
    try {
        const coll = client.db(DB).collection(COLLECTION);

        const query = { tokenId: tokenId, tokenAddress: tokenAddress };
        const one = await coll.findOne(query);
        if (one == null) {
            coll.insertOne(param);
        } else if (one.status != param.status) {
            coll.updateOne(query, param);
        }
    } catch (error) {
        console.error(error)
    }
}

exports.queryMyTokens = async function queryMyTokens(tokenAddress, owner, status) {
    try {
        const coll = client.db(DB).collection(COLLECTION);

        const query = { tokenAddress: tokenAddress, owner: owner };
        if (status != null) {
            query.status = status;
        }

        const options = {
            sort: { updateDate: -1 }
        };

        const list = await coll.find(query, options);

        return list;
    } catch (error) {
        console.error(error)
    }
}

exports.queryAll = async function queryAll(tokenAddress, pageIndex, pageSize) {
    try { 
        const coll = client.db(DB).collection(COLLECTION);

        const query = {tokenAddress: tokenAddress };
        const options = {
            skip: (pageIndex - 1) * pageSize,
            limit: pageSize,
            sort: { updateDate: -1 }
        };

        const list = await coll.find(query, options).toArray();
        return list; 
    } catch (error) {
        console.error(error)
    }
}

exports.queryOne = async function queryOne(tokenAddress, tokenId) {
    try {
        const coll = client.db(DB).collection(COLLECTION);

        const query = { tokenId: tokenId, tokenAddress: tokenAddress };
        const one = await coll.findOne(query);

        return one;
    } catch (error) {
        console.error(error)
    }
}