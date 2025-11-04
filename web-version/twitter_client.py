import tweepy

class TwitterClient:
    """Client for Twitter API v2"""
    
    def __init__(self, api_key, api_secret, access_token, access_secret):
        # Authenticate to Twitter
        self.client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_secret
        )
    
    def post_tweet(self, text):
        """Post a tweet"""
        try:
            # Validate tweet length
            if len(text) > 280:
                raise ValueError(f"Tweet too long: {len(text)} characters (max 280)")
            
            if len(text) == 0:
                raise ValueError("Tweet cannot be empty")
            
            response = self.client.create_tweet(text=text)
            
            # Check if response has data
            if not response or not response.data:
                raise Exception("No response data from Twitter API")
            
            return {
                'id': response.data['id'],
                'text': text
            }
        except Exception as e:
            raise Exception(f"Failed to post tweet: {str(e)}")
