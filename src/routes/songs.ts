import { IncomingMessage, ServerResponse } from "http";
import { getAllSongs, getSongById, addSong } from "../controllers/songs";

export const songsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/songs")) {
    console.log(req.url, "request url");

    // https:localhost:3000/songs/1
    const urlParts = req.url.split("/");
    console.log(urlParts, "urlParts");

    const id = urlParts[2] ? parseInt(urlParts[2]) : undefined;

    // if the request is a GET to /songs

    if (req.method === "GET" && !id) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getAllSongs()));
      return;
    }
    // if the request is a GET to /songs/:id
    if (req.method === "GET" && id) {
      if (isNaN(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid song ID" }));
        return;
      }

      const song = getSongById(id);

      if (!song) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Song not found" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(song));
      return;
    }

    // if the request is a POST to /songs
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        console.log(chunk, "chunk");
        body += chunk.toString();
        console.log(body, "body");
      });

      req.on("end", () => {
        try {
          const { title, artist, duration } = JSON.parse(body);
          if (!title || typeof title !== "string") {
            res
              .writeHead(400, { "Content-Type": "application/json" })
              .end(JSON.stringify({ message: "Song title is required" }));
            return;
          }

          if (!artist || typeof artist !== "string") {
            res
              .writeHead(400, { "Content-Type": "application/json" })
              .end(JSON.stringify({ message: "Song artist is required" }));
            return;
          }

          if (!duration || typeof duration !== "number") {
            res
              .writeHead(400, { "Content-Type": "application/json" })
              .end(JSON.stringify({ message: "Song duration is required" }));
            return;
          }

          const newSong = addSong(title, artist, duration);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newSong));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON" }));
        }
      });
      return;
    }
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Method Not Allowed" }));
    return;
  }
};
