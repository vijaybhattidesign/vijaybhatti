"""Local dev server with extensionless .html fallback."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        clean_path = self.path.split("?", 1)[0]
        query = ("?" + self.path.split("?", 1)[1]) if "?" in self.path else ""
        translated = self.translate_path(clean_path)

        if not os.path.isfile(translated):
            basename = os.path.basename(clean_path.rstrip("/"))
            if basename and "." not in basename:
                html_path = clean_path.rstrip("/") + ".html"
                if os.path.isfile(self.translate_path(html_path)):
                    self.path = html_path + query

        return super().do_GET()


if __name__ == "__main__":
    port = 5500
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Serving {ROOT}")
    print(f"Open http://localhost:{port}/")
    server.serve_forever()
