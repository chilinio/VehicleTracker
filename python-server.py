import http.server
import socketserver
import os
import json
from urllib.parse import urlparse, parse_qs

# Configuration
PORT = 3001
DIRECTORY = os.path.join(os.getcwd(), "dist", "public")

# Ensure the directory exists
if not os.path.exists(DIRECTORY):
    os.makedirs(DIRECTORY, exist_ok=True)

# Custom request handler
class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # API routes
        if parsed_path.path.startswith('/api/'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            # Mock services API
            if parsed_path.path == '/api/services':
                self.wfile.write(json.dumps([
                    {
                        "title": "Routine Maintenance",
                        "description": "Keep your vehicle in peak condition with our comprehensive maintenance services including oil changes, filter replacements, and fluid checks.",
                        "image": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                        "title": "Diagnostics & Repair",
                        "description": "Our expert technicians use advanced technology to diagnose and resolve issues quickly, getting you back on the road safely.",
                        "image": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                        "title": "Performance Upgrades",
                        "description": "Enhance your vehicle's performance with custom tuning, suspension upgrades, exhaust systems, and more.",
                        "image": "https://images.unsplash.com/photo-1611396058741-1d570a4fcf95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                        "title": "Body Work & Paint",
                        "description": "From minor dent repairs to complete custom paint jobs, our skilled technicians deliver exceptional results.",
                        "image": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                        "title": "Interior Detailing",
                        "description": "Revitalize your vehicle's interior with our premium detailing services, from deep cleaning to leather restoration.",
                        "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                        "title": "Wheel & Tire Services",
                        "description": "Complete tire and wheel services including alignment, balancing, custom wheels, and premium tire options.",
                        "image": "https://images.unsplash.com/photo-1627921879972-1492fbc1183e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    }
                ]).encode())
                return
        
        # For any other path, serve files normally
        return super().do_GET()

# Set up and start the server
handler = CustomHTTPRequestHandler
with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print(f"Serving files from: {DIRECTORY}")
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever() 