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
    
    def get_trending_topics(self, limit=10):
        """Get trending topics from Membit"""
        try:
            # First, try to list available tools
            tools_response = self.list_tools()
            
            # Get the first available tool or use a default method
            available_tools = tools_response.get('result', {}).get('tools', [])
            
            if not available_tools:
                # If no tools listed, try direct call
                return self._call_trending_api()
            
            # Use the first tool that seems related to trending/topics
            tool_name = None
            for tool in available_tools:
                tool_name = tool.get('name', '')
                if any(keyword in tool_name.lower() for keyword in ['trend', 'topic', 'news', 'feed', 'get']):
                    break
            
            if not tool_name and available_tools:
                tool_name = available_tools[0].get('name')
            
            print(f"Using tool: {tool_name}")
            
            # Call the tool
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json={
                    "jsonrpc": "2.0",
                    "id": 2,
                    "method": "tools/call",
                    "params": {
                        "name": tool_name,
                        "arguments": {}
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
