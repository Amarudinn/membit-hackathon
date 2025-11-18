import { Twitter, ExternalLink } from 'lucide-react'
import './LastTweet.css'

function LastTweet({ tweet }) {
  return (
    <div className="card last-tweet">
      <h2>
        <Twitter size={20} />
        Last Tweet
      </h2>
      {tweet ? (
        <div className="tweet-content">
          <p>{tweet.text}</p>
          <div className="tweet-meta">
            <span className="tweet-time">{tweet.timestamp}</span>
            <a 
              href={tweet.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <ExternalLink size={16} />
              View on Twitter
            </a>
          </div>
        </div>
      ) : (
        <div className="tweet-content empty">
          <p className="empty-message">No tweets posted yet. Click "Run Once" or "Start Bot" to post your first tweet!</p>
        </div>
      )}
    </div>
  )
}

export default LastTweet
