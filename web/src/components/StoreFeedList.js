import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import styles from './StoreFeedList.module.css'

const StoreFeedList = ({data, subscribeToNewFeeds}) => {
    useEffect(() => subscribeToNewFeeds());
    return data.map(it => <div className={styles.list_item} key={it.id}><Link to={`/store/feed/${it.id}`}>{it.title || it.link}</Link><span><a href={`${process.env.REACT_APP_XREAD_URL}#/feed/subscribe?url=${it.link}&title=${it.title}`} target='_blank'>订阅</a></span></div>)
};
export default StoreFeedList;