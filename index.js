import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  // use else/if instead of if so only one of these options runs
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === 'tweet-btn'){
    handleTweetBtnClick();
  }
})
 
function handleLikeClick(tweetId){ 
  const targetTweetObj = tweetsData.filter(tweet => {
    return tweet.uuid === tweetId
  })[0] // get the first (only) element of the array built by filter

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes -= 1;
  } else {
    targetTweetObj.likes += 1;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked // flip boolean value
  render()
}

function handleRetweetClick(tweetId){
  const targetTweetObj = tweetsData.filter(tweet => {
    return tweet.uuid === tweetId
  })[0] // get the first (only) element of the array built by filter
  
  if(targetTweetObj.isRetweeted){
    targetTweetObj.retweets -= 1;
  } else{
    targetTweetObj.retweets += 1;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted // flip the boolean value
  render() 
}

function handleReplyClick(replyId){
  document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleTweetBtnClick(){
  const tweetInput = document.getElementById('tweet-input');

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4()
    })
    render()
    tweetInput.value = '';
  }
}

function getFeedHtml() {
  let feedHtml = ``

  tweetsData.forEach(tweet => {
    let likeIconClass;
    let retweetIconClass;
    tweet.isLiked ? likeIconClass = 'liked' : likeIconClass = '';
    tweet.isRetweeted ? retweetIconClass = 'retweeted' : retweetIconClass = '';
    
    let repliesHtml = ''
    
    if (tweet.replies.length) { 
      tweet.replies.forEach(reply => {
        repliesHtml += `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
              <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
              </div>
          </div>
        </div>`
        })
      }

      feedHtml += `
      <div class="tweet">
        <div class="tweet-inner">
          <img src="${tweet.profilePic}" class="profile-pic">
          <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
              <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                ${tweet.replies.length}
              </span>
              <span class="tweet-detail">
                  <i class="fa-solid fa-heart ${likeIconClass}"
                  data-like="${tweet.uuid}"
                  ></i>
                  ${tweet.likes}
              </span>
              <span class="tweet-detail">
                  <i class="fa-solid fa-retweet ${retweetIconClass}"
                  data-retweet="${tweet.uuid}"
                  ></i>
                  ${tweet.retweets}
              </span>
            </div>   
          </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>   
      </div>`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

