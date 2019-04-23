// @flow
import {MongoClient, ObjectId} from "mongodb";
import assert from "assert";
import {db_name, getList, getOne, mongoConnectionString} from "./util";


export async function getTemplate(id: string) {
    return getOne("template", id)
}

export async function getTemplates({first, after, last, before}: { first: number, after: number, last: string, before: string }) {
    return await getList("template", {first, after, last, before})
}

export async function addTemplate({link, title, params}: { link: string, title: string, params: [{ name: string, values: [string] }] }) {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const update = {link, title, params};
        const response = await database.db(db_name).collection("template").insertOne(update);
        const result = await database.db(db_name).collection("template").findOne({_id: ObjectId(response.insertedId)});
        if (result) {
            result.id = result._id.toString();
        }
        return result;
    } catch (e) {
        console.log(e.message);
        return null;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function getFeed(id: string) {
    return getOne("feed", id)
}

type getFeedsParam = { first: number, after: number, last: string, before: string, keyword: string };

export async function getFeeds({first, after, last, before, keyword}: getFeedsParam) {
    return await getList("feed", {first, after, last, before})
}

export async function addFeed({link, title}: { link: string, title: string }) {
    let database;
    try {
        database = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true});
        const filter = {link};
        const update = {$set: {link, title}};
        const response = await database.db(db_name).collection("feed").updateOne(filter, update, {upsert: true});
        const result = await database.db(db_name).collection("feed").findOne(filter);
        if (result) {
            result.id = result._id.toString();
        }
        return result;
    } catch (e) {
        console.log(e.message);
        return null;
    } finally {
        if (database) {
            await database.close();
        }
    }
}

export async function getArticles(args: any) {
    console.log(`getArticles:args=${JSON.stringify(args)}`);
    let {first, after, last, before, feedId, tag, topic, box, read = "all"} = args;
    assert(!!first || !!last, "first or last should grate then 0");
    assert(!(!!first && !!last), 'first or last cannot set same time');
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
    if (feedId) {
        query.feedId = feedId;
    }
    if (tag) {
        query.tags = tag;
    }
    if (topic) {
        query.topic = topic;
    }
    switch (box) {
        case "inbox":
            query.spam = {$ne: true};
            break;
        case "spam":
            query.spam = true;
            break;
        default:
            break;
    }
    switch (read) {
        case "unread":
            query.read = {$ne: true};
            break;
        case "readed":
            query.read = true;
            break;
        default:
            break;
    }
    const result: [] = await database.db(db_name).collection("article").find(query).sort(sort).limit(limit).toArray();
    await database.close();
    result.forEach(it => it.id = it._id.toString());
    return result;
}
