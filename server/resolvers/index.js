// schema.  We'll retrieve books from the "books" array above.
import {addFeed, addTemplate, getArticles, getFeed, getFeeds, getTemplates} from "../service";
import {makeConnection} from "../relay";

const {PubSub} = require('apollo-server');
const pubsub = new PubSub();

const FEED_ADDED = "FEED_ADDED";
export const resolvers = {
    Node: {
        __resolveType: (obj) => {
            if (obj.__type) return obj.__type;
            if (obj.name) {
                return "Tag"
            } else if (obj.title) {
                if (obj.summary) {
                    return "Article"
                } else {
                    return "Feed"
                }
            }
            return null
        }
    },

    Article: {
        summary: ({summary = ""}) => {
            return summary.replace(/<[^>]+>/g, "")
        },
        feed: ({id}, {}) => {
            return getFeed(id)
        },
    },
    Feed: {
        articles: async (parent, args) => await makeConnection(getArticles)({...args, feedId: parent.id}),
    },
    Query: {
        feeds: async (parent, args) => await makeConnection(getFeeds)(args),
        templates: async (parent, args) => await makeConnection(getTemplates)(args),
        node: async (parent, {id, type}) => {
            if (type) {
                switch (type) {
                    case "Feed":
                        const feed = await getFeed(id);
                        if (feed) {
                            feed.id = feed._id;
                            feed.__type = "Feed";
                            return feed;
                        }
                        break;
                    case "Tag":
                        return ({id: id, name: id, __type: type || "Tag"});
                    case "Topic":
                        return ({id: id, name: id, __type: type || "Topic"});
                }
            }
            if (!(type && type !== "Feed")) {
                const feed = await getFeed(id);
                if (feed) {
                    feed.id = feed._id;
                    feed.__type = "Feed";
                    return feed;
                }
            }
            if (id)
                return ({id: id, name: id, __type: type || "Tag"});
            else
                return null
        },
    },
    Mutation: {
        addFeed: async (root, args) => {
            let feed = await addFeed(args);
            pubsub.publish(FEED_ADDED, {feedAdded: feed});
            return feed;
        },
        addTemplate: async (root, args) => {
            let {link, title, params} = args;
            return await addTemplate({link, title, params: JSON.parse(params || "{}")});
        },
    },
    Subscription: {
        feedAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([FEED_ADDED]),
        }
    },
};