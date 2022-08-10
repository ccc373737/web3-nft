const { MongoClient } = require("mongodb");

const uri = "mongodb://admin:admin123@43.142.34.153:27017/";
const client = new MongoClient(uri);

const DB = "market";
const COLLECTION = "token";

exports.insertOrUpdate = async function insertOrUpdate(tokenAddress, tokenId, param) {
    try {
        const database = client.db(DB);
        const coll = database.collection(COLLECTION);

        const query = { tokenId: tokenId, tokenAddress: tokenAddress };
        const one = await coll.findOne(query);
        if (one == null) {
            coll.insertOne(param);
        } else if (one.status != param.status) {
            coll.updateOne(query, param);
        }
    } catch (error) {
        console.log(error)
    } finally {
        await client.close();
    }
}

exports.queryMyTokens = async function queryMyTokens(tokenAddress, owner, status) {
    try {
        const database = client.db(DB);
        const coll = database.collection(COLLECTION);

        const query = { tokenAddress: tokenAddress, owner: owner };
        if (status != null) {
            query.status = status;
        }

        const options = {
            sort: { updateDate: -1 }
        };

        const list = await coll.find(query, options);

        return list;
    } finally {
        await client.close();
    }
}

exports.queryAll = async function queryAll(tokenAddress, pageIndex, pageSize) {
    try {
        client.connect();
        const coll = await client.db(DB).collection(COLLECTION);

        const query = {tokenAddress: tokenAddress };
        const options = {
            skip: (pageIndex - 1) * pageSize,
            limit: pageSize,
            sort: { updateDate: -1 }
        };

        const list = await coll.find(query, options).toArray();
        return list;
    } finally {
        await client.close();
    }
}

exports.queryOne = async function queryOne(tokenAddress, tokenId) {
    try {
        client.connect();
        const coll = await client.db(DB).collection(COLLECTION);

        const query = { tokenId: tokenId, tokenAddress: tokenAddress };
        const one = await coll.findOne(query);

        return one;
    } finally {
        await client.close();
    }
}