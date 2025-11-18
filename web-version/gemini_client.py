import os
import google.generativeai as genai

# Suppress warnings
os.environ['GRPC_VERBOSITY'] = 'ERROR'
os.environ['GLOG_minloglevel'] = '2'

class GeminiClient:
    """Client for Google Gemini API"""
    
    def __init__(self, api_key):
        if not api_key:
            raise ValueError("Gemini API key is required")
        
        genai.configure(api_key=api_key)
        # Use Gemini 2.5 Flash - stable version released June 2025
        self.model = genai.GenerativeModel('models/gemini-2.5-flash')
    
    def generate_content(self, prompt):
        """Generate content using Gemini"""
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            raise Exception(f"Failed to generate content with Gemini: {str(e)}")
    
    def generate_image_prompt(self, tweet_text):
        """Generate image prompt from tweet text"""
        try:
            prompt = f"""Based on this tweet: "{tweet_text}"

Create a SHORT image generation prompt (maximum 80 characters) for an AI image generator.
Focus ONLY on visual elements, colors, and style.

Rules:
- Maximum 80 characters
- No text or words in the image
- Focus on abstract concepts and visuals
- Use descriptive adjectives

Examples:
Tweet: "Web3 is revolutionizing gaming"
Prompt: "futuristic gaming metaverse, neon blue, blockchain network, digital art"

Tweet: "Bitcoin reaches new heights"
Prompt: "golden bitcoin coin, upward arrow, financial growth, modern minimal"

Now create the prompt (ONLY the prompt, no explanation):"""
            
            response = self.model.generate_content(prompt)
            image_prompt = response.text.strip().strip('"').strip("'")
            
            # Limit to 80 chars
            if len(image_prompt) > 80:
                image_prompt = image_prompt[:77] + "..."
            
            return image_prompt
            
        except Exception as e:
            raise Exception(f"Failed to generate image prompt: {str(e)}")
