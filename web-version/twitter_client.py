import tweepy

class TwitterClient:
    """Client for Twitter API v2"""
    
    def __init__(self, api_key, api_secret, access_token, access_secret):
        # Authenticate to Twitter (v2)
        self.client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_secret
        )
        
        # Also authenticate v1.1 API for media upload
        auth = tweepy.OAuth1UserHandler(
            api_key, api_secret, access_token, access_secret
        )
        self.api_v1 = tweepy.API(auth)
    
    def upload_media(self, image_path):
        """Upload media to Twitter (v1.1 API)"""
        try:
            media = self.api_v1.media_upload(image_path)
            return media.media_id
        except Exception as e:
            raise Exception(f"Failed to upload media: {str(e)}")
    
    def post_tweet(self, text, media_ids=None):
        """Post a tweet with optional media"""
        try:
            # Validate tweet length
            if len(text) > 280:
                raise ValueError(f"Tweet too long: {len(text)} characters (max 280)")
            
            if len(text) == 0:
                raise ValueError("Tweet cannot be empty")
            
            # Post with or without media
            if media_ids:
                response = self.client.create_tweet(text=text, media_ids=media_ids)
            else:
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
