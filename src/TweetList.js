import React, { useState } from 'react';
import './App.css';

function TweetList({tweets, selectTweet, listType}) {    
    const [selected, setSelected] = useState(-1);
    const onSelectTweet = (index, e) => {
        setSelected(index);
        selectTweet(index);
    }

    const onDragStart = (e, tweetIndex) => {
      console.log('onDragStart:' + tweetIndex);    
      e.dataTransfer.setData("tweetIndex", tweetIndex);
      console.log('onDragStart done');    
    }

    const formatTime = (val) => {
      const d = new Date(val);
      return d.toDateString();
    }
  
    //const dragDrop = listType === "search" ? "draggable" : "droppable"
    const tweetList = tweets.map((tweet, index) => 
        <div style={{padding:"3px"}}
            onClick={(e) => onSelectTweet(index)} 
            key={index} 
            index={index} 
            draggable={listType === "search" ? "true" : "false"}
            onDragStart={(e) => onDragStart(e, index)}
            className={"tweet droppable" + (index === selected ? " selected" : "") }
            >
              <div style={{width:"100%"}}>
                <span style={{}}>
                  <span style={{}}>{tweet.userName}</span>
                  <span style={{paddingLeft:"10px",fontSize:"smaller"}}>@{tweet.screenName}</span>
                </span>
                <span style={{float:"right"}}>{formatTime(tweet.time)}</span>              
              </div>
              <div style={{padding:"6px",fontSize:"smaller"}}>
                {tweet.text}
              </div>                

        </div>
    )
    //const tweetList = JSON.stringify(tweets);
  return (
    <div className="TweetList"
      >
       {tweetList}
    </div>
  );
}

export default TweetList;
