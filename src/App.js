import React from 'react';
import './App.css';
import SearchBar from './SearchBar.js'
import TweetList from './TweetList.js'
import { sampleData } from './sampleData.js'
//import './client.js'

// source:  https://github.com/facebook/create-react-app/issues/4422
const $ = window.$;

const yourJSONPCallbackFn = (val) => {
  alert('yourJSONPCallbackFn');
}

const testMode = false; //TODO_DOUG: FIX THE CORS ERROR
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      isLoading: false,
      selectedTweet: null,
      searchTweets : [        
      ]
      , savedTweets : [        
      ]
    }
  }

  yourJSONPCallbackFn = (val) => {
    console.log('yourJSONPCallbackFn');
  }
  selectTweet = (index) => {
    this.setState({selectedTweet: index})
  }
  clearSaved = () => {
    const tweets = [];
    const tweetsAsStr = JSON.stringify(tweets);
    console.log('clearSaved:')
    this.setState ({savedTweets: tweets});
    window.localStorage.setItem('savedTweets', tweetsAsStr);
  }
  saveTweet = (index) => {
    console.log('saveTweet:' + index)
    if (index < 0 || index > this.state.searchTweets.length) {
      alert('saveTweet - index is out of range')
      return
    }
    const tweet = this.state.searchTweets[index];    
    const tweets = this.state.savedTweets.concat(tweet);
    const tweetsAsStr = JSON.stringify(tweets);
    console.log('saveTweet:' + index)
    this.setState ({savedTweets: tweets});
    window.localStorage.setItem('savedTweets', tweetsAsStr);
  }

  execSearch = (queryString) => {
    console.log('execSearch: ' + queryString);
    if (queryString === '') {
      alert('Search string cannot be empty')
      return
    }

    //-------------------------------------------
    // get test data (no fetch)
    //-------------------------------------------
    if (testMode) {
      const tweets = sampleData.tweets.map((tweet) => {
        //console.log(tweet.text);
        return {
          text : tweet.text 
        }
      });
      console.log(tweets);
      this.setState ({searchTweets: tweets});
      return;
    }    

    //-------------------------------------------
    // get real data (currently experiencing cross-origin error)
    //-------------------------------------------    
    //const url = `http://tweetsaver.herokuapp.com/?q=${queryString}&callback=yourJSONPCallbackFn&count=10`
    const url = `http://tweetsaver.herokuapp.com/?q=${queryString}&count=5`
    console.log('execSearch: ' + url);

      // THIS FETCH WORKS WITHOUT A PROXY SERVER!!!!!!!
      // source:  https://gist.github.com/jesperorb/6ca596217c8dfba237744966c2b5ab1e
    $.ajax({
      method: 'GET',
      url: url,
      dataType: 'jsonp', //change the datatype to 'jsonp' works in most cases
      success: (data) => {
        console.log('AJAX get succeeded');
        //console.log(data);
        const tweets = data.tweets.map((tweet) => {
          //console.log(tweet.text);
          return {
            text : tweet.text,
            id : tweet.id, 
            userName : tweet.user.name,
            screenName : tweet.user.screenName,
            time : tweet.createdAt
          }
        });
        //console.log(tweets);
        this.setState ({searchTweets: tweets});
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
          alert("Status: " + textStatus + " Error: " + errorThrown); 
      }      
    })
     
    return;

    // THIS FETCH USES A CORS PROXY SERVER
    // I UNDERSTAND THAT IT IS *NOT* A CORRECT SOLUTION, BUT I AM RUNNING SHORT ON TIME NOW.
    // source:  https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    fetch(proxyUrl + url)
      .then(blob => blob.json())
      .then(data => {
        //console.table(data);
        //console.log(JSON.stringify(data, null, 2));
        const tweets = data.tweets.map((tweet) => {
          //console.log(tweet.text);
          return {
            text : tweet.text,
            id : tweet.id, 
            userName : tweet.user.name,
            screenName : tweet.user.screenName,
            time : tweet.createdAt
          }
        });
        console.log(tweets);
        this.setState ({searchTweets: tweets});
      })
      .catch(e => {
        console.log(e);
        return e;
      });
    return

    // THIS IS MY ORIGINAL FETCH.  
    // DESPITE HOURS OF SEARCHING AN TRIALS, I DID NOT FIGURE OUT A WAY TO PREVENT THE CROSS-ORIGIN ERROR
    // USING THE BASIC fetch() FUNCTION - Doug
    fetch(url, { mode: 'no-cors' }) 
    .then(response => {
      //console.log('cp1: response' + response.json());
      console.log('cp1: response' + response);
      response.json()
      console.log('cp2');
    })
    .then(
      (data) => {
        alert(data);
        this.setState({
          searchTweets: data,
          isLoading: false,
        })
      }
    )
    .catch((error) => {
      alert('fetch error:' + error);
      this.setState({ isError: true, isLoading: false, searchTweets: [] });
    })
  }

  componentDidMount() {
    console.log('componentDidMount');
    const ob = window.localStorage.getItem('savedTweets');
    if (ob !== undefined && ob != null) {
      console.log(ob);
      const tweets = JSON.parse(ob);
      this.setState ({savedTweets: tweets});
    }
    else {
      console.log('componentDidMount - local storage is empty')
    }
  }

  onDrop = (e) => {
    e.preventDefault();
    //e.stopPropagation();
    console.log('onDrop');    
    var tweetIndex = e.dataTransfer.getData("tweetIndex");
    console.log('onDrop:' + tweetIndex);
    this.saveTweet(tweetIndex);
  }

  onDragOver = (e) => {
    e.preventDefault();
    //e.stopPropagation();
    console.log('onDragOver');   
    return true; 
  }

  render() {
    return <div className="App">
      <div>
        <h1>Tweet Saver</h1>
        <hr />
        <SearchBar execSearch={this.execSearch} />
        <div>
          <div className="list-container search-list">
            <TweetList tweets={this.state.searchTweets} selectTweet={this.selectTweet} listType="search"/>
          </div>
          <button className="btn save-btn" onClick={(e) => this.saveTweet(this.state.selectedTweet)}>Save</button>
          <button className="btn clear-btn" onClick={(e) => this.clearSaved()}>Clear</button>
          <div className="list-container saved-list"
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(e) => this.onDrop(e)}
            >
            <TweetList tweets={this.state.savedTweets} selectTweet={this.selectTweet} listType="saved"/>
          </div>
        </div>
      </div>
    </div>
  }
}

export default App;
