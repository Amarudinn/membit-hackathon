import requests
import json

class MembitClient:
    """Client for Membit MCP API"""
    
    def __init__(self, api_key):
        self.api_key = api_key
        self.endpoint = "https://mcp.membit.ai/mcp"
        self.headers = {
            "X-Membit-Api-Key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream"
        }
    
    def list_tools(self):
        """List available tools from Membit MCP"""
        try:
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json={
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "tools/list"
                },
                timeout=30,
                stream=True
            )
            response.raise_for_status()
            
            # Parse SSE response
            result = self._parse_sse_response(response)
            return result
            
        except Exception as e:
            raise Exception(f"Failed to list tools: {str(e)}")
    
    def _parse_sse_response(self, response):
        """Parse Server-Sent Events response"""
        result = None
        for line in response.iter_lines(decode_unicode=True):
            if line:
                # SSE format: data: {...}
                if line.startswith('data: '):
                    data_str = line[6:]  # Remove 'data: ' prefix
                    try:
                        result = json.loads(data_str)
                    except json.JSONDecodeError:
                        continue
        return result if result else {}
    
    def get_trending_topics(self, query="Web3", limit=10):
        """Get trending topics from Membit using clusters_search"""
        try:
            # Use clusters_search tool (recommended for trending discussions)
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json={
                    "jsonrpc": "2.0",
                    "id": 2,
                    "method": "tools/call",
                    "params": {
                        "name": "clusters_search",
                        "arguments": {
                            "q": query,
                            "limit": limit
                        }
                    }
                },
                timeout=30,
                stream=True
            )
            
            response.raise_for_status()
            data = self._parse_sse_response(response)
            
            # Format the trending data
            if data.get('result'):
                return self._format_trending_data(data['result'])
            
            return "No trending data available"
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to fetch Membit data: {str(e)}")
    
    def _call_trending_api(self):
        """Fallback method to call trending API directly"""
        response = requests.post(
            self.endpoint,
            headers=self.headers,
            json={
                "jsonrpc": "2.0",
                "id": 2,
                "method": "tools/call",
                "params": {
                    "name": "get_trending",
                    "arguments": {}
                }
            },
            timeout=30,
            stream=True
        )
        response.raise_for_status()
        data = self._parse_sse_response(response)
        
        if data.get('result'):
            return self._format_trending_data(data['result'])
        
        return "No trending data available"
    
    def get_cluster_info(self, label, limit=10):
        """Get detailed information about a specific cluster"""
        try:
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json={
                    "jsonrpc": "2.0",
                    "id": 3,
                    "method": "tools/call",
                    "params": {
                        "name": "clusters_info",
                        "arguments": {
                            "label": label,
                            "limit": limit
                        }
                    }
                },
                timeout=30,
                stream=True
            )
            
            response.raise_for_status()
            data = self._parse_sse_response(response)
            
            if data.get('result'):
                return self._format_trending_data(data['result'])
            
            return "No cluster info available"
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to fetch cluster info: {str(e)}")
    
    def search_posts(self, query, limit=10):
        """Search for specific posts"""
        try:
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json={
                    "jsonrpc": "2.0",
                    "id": 4,
                    "method": "tools/call",
                    "params": {
                        "name": "posts_search",
                        "arguments": {
                            "q": query,
                            "limit": limit
                        }
                    }
                },
                timeout=30,
                stream=True
            )
            
            response.raise_for_status()
            data = self._parse_sse_response(response)
            
            if data.get('result'):
                return self._format_trending_data(data['result'])
            
            return "No posts found"
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to search posts: {str(e)}")
    
    def _format_trending_data(self, data):
        """Format trending data for better readability"""
        # Handle different response formats
        if isinstance(data, dict):
            if 'content' in data:
                # MCP format with content array
                content = data['content']
                if isinstance(content, list) and len(content) > 0:
                    return content[0].get('text', str(data))
            elif 'text' in data:
                return data['text']
        
        if isinstance(data, list):
            formatted = "Trending Topics:\n"
            for idx, item in enumerate(data, 1):
                if isinstance(item, dict):
                    title = item.get('title', item.get('name', 'Unknown'))
                    description = item.get('description', '')
                    formatted += f"{idx}. {title}"
                    if description:
                        formatted += f" - {description}"
                    formatted += "\n"
            return formatted
        
        return str(data)
