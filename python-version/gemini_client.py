import google.generativeai as genai

class GeminiClient:
    """Client for Google Gemini API"""
    
    def __init__(self, api_key):
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
