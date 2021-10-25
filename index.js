const express = require("express");
const { Connection } = require("tedious");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
let status = "Not connected";
let connecting = false;
let error = "";

const config = {
  server: process.env.DB_SERVER,
  authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  },
  options: {
    database: process.env.DB_NAME,
    encrypt: true,
    port: 1433,
  },
};

const connection = new Connection(config);
console.log(process.env);
connection.on("connect", (err) => {
  if (err) {
    error = err.message;
  } else {
    status = "Connected";
  }
});

connecting = true;
connection.connect(() => {
  connecting = false;
});

app.get("/", (_req, res) => {
  const errorResponse = error ? `Error: ${error}` : "";
  const response = connecting
    ? "Server still connecting, try again later"
    : `Database connection status: ${status}`;
  res.send(`${response}. ${errorResponse}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
