import http, { IncomingMessage, ServerResponse } from "http";
import { songsRoute } from "./routes/songs";

const PORT = 3000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/songs")) {
    songsRoute(req, res);
    return;
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "404! Page not found" }));
  }
};

// create a new server instance
const server = http.createServer(requestListener);

// start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// add routes logic
