import server from "../src/server";

export const config = {
  runtime: "edge",
};

export default (request: Request) => {
  return server.fetch(request, {}, {});
};
