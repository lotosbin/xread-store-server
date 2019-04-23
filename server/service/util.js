import {MongoClient, ObjectId} from "mongodb";

export const mongoConnectionString = process.env.MONGO;
export const db_name = "xread";

export async function getOne(collectionName: string, id: string) {
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const result = await database.db(db_name).collection(collectionName).findOne({_id: new ObjectId(id)});
    await database.close();
    if (result) result.id = result._id.toString();
    return result;
}


export async function getList(collectionName: string, {first, after, last, before}) {
    const database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
    const query = {};
    let sort;
    let limit;
    if (first) {
        sort = {_id: 1};
        limit = first;
        if (after) {
            query._id = {$gt: new ObjectId(after)};

        }
    } else {
        sort = {_id: -1};
        limit = last;
        if (before) {
            query._id = {$lt: new ObjectId(before)};
        }
    }

    let collection = database.db(db_name).collection(collectionName);
    const result: [] = await collection.find(query).sort(sort).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    console.log(`getList:${JSON.stringify(result)}`);
    return result;
}
