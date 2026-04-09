import { createReadStream, existsSync, statSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 5173);
const distDir = join(process.cwd(), "dist");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const resolveFilePath = (urlPath) => {
  const sanitizedPath = normalize(decodeURIComponent(urlPath.split("?")[0]))
    .replace(/^[/\\]+/, "")
    .replace(/^(\.\.[/\\])+/, "");
  const requestedFile = join(distDir, sanitizedPath);
  const requestedExtension = extname(sanitizedPath);

  if (existsSync(requestedFile)) {
    const requestedStats = statSync(requestedFile);

    if (requestedStats.isFile()) {
      return { filePath: requestedFile, isSpaFallback: false };
    }
  }

  if (!requestedExtension) {
    return { filePath: join(distDir, "index.html"), isSpaFallback: true };
  }

  return null;
};

const server = createServer(async (request, response) => {
  try {
    const resolved = resolveFilePath(request.url || "/");
    if (!resolved) {
      response.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end("Not found");
      return;
    }

    const { filePath } = resolved;
    const fileStats = await stat(filePath);
    const extension = extname(filePath);

    response.writeHead(200, {
      "Content-Length": fileStats.size,
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control":
        extension === ".html"
          ? "no-store, max-age=0, must-revalidate"
          : "public, max-age=31536000, immutable",
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Static app listening on http://0.0.0.0:${port}`);
});
