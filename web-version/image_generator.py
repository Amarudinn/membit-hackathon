import requests
import os
from pathlib import Path
from urllib.parse import quote

class ImageGenerator:
    """Client for Pollinations.ai image generation"""
    
    def __init__(self):
        self.base_url = "https://image.pollinations.ai/prompt"
        self.temp_dir = Path(__file__).parent / 'temp'
        self.temp_dir.mkdir(exist_ok=True)
    
    def generate_image(self, prompt, width=1200, height=675, style="digital art"):
        """
        Generate image from text prompt using Pollinations.ai
        
        Args:
            prompt: Text description for image
            width: Image width (default 1200 for Twitter)
            height: Image height (default 675 for Twitter 16:9)
            style: Image style (digital art, realistic, minimalist, etc.)
        
        Returns:
            Path to downloaded image file
        """
        try:
            # Add style to prompt
            full_prompt = f"{prompt}, {style}"
            
            # URL encode the prompt
            encoded_prompt = quote(full_prompt)
            
            # Build URL with parameters
            url = f"{self.base_url}/{encoded_prompt}"
            params = {
                'width': width,
                'height': height,
                'nologo': 'true',  # Remove watermark
                'enhance': 'true'   # Better quality
            }
            
            # Download image
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            # Save to temp file
            image_path = self.temp_dir / 'tweet_image.jpg'
            with open(image_path, 'wb') as f:
                f.write(response.content)
            
            return str(image_path)
            
        except Exception as e:
            raise Exception(f"Failed to generate image: {str(e)}")
    
    def cleanup(self):
        """Remove temporary image files"""
        try:
            for file in self.temp_dir.glob('*.jpg'):
                file.unlink()
        except Exception:
            pass
