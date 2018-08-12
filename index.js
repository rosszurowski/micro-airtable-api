require("dotenv").config();

const getConfig = require("./src/config");
const createServer = require("./src/server");

let config;

try {
  config = getConfig(process.env);
} catch (err) {
  exit(err);
}

const server = createServer(config);

server.listen(config.port, err => {
  if (err) {
    exit(err);
    return;
  }

  console.log(`micro-airtable-api listening on port ${config.port}`);
});

function exit(err) {
  console.error("Error:", err.message);
  process.exit(1);
}
