import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
handler = http.server.SimpleHTTPRequestHandler
server = http.server.HTTPServer(('localhost', 3000), handler)
print(f'Server running at http://localhost:3000')
server.serve_forever()
