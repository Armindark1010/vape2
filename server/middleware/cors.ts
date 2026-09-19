export default defineEventHandler((event) => {
  const req = event.node.req;
  const res = event.node.res;

  const origin = req.headers.origin || "*";

  // Allow localhost origins (Angular admin on 4200, Nuxt on 3000/3001, etc.)
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.statusMessage = "No Content";
    return "";
  }
});
