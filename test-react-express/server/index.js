const PORT = 8080;
const express = require("express");
const app = express();
app.use(require("cors")());
// library for getting the cmd

const { exec } = require("child_process");

app.get("/getusers", (req, res) => {
  exec("net user", (error, stdout, stderr) => {
    if (error) {
      console.log(error);
    }
    if (stderr) console.log(stderr);
    stdout;
    const pattern = /(?<= )[A-Za-z0-9_]+/g;
    const userNames = stdout.match(pattern);
    res.status(200).send(userNames);
  });
});

app.get("/getinfo", (req, res) => {
  exec("systeminfo", (error, stdout, stderr) => {
    if (error) console.log(error);
    if (stderr) console.log(stderr);
    stdout;
    /* 
    const systemInfo = {};
    const lines = stdout.trim().split("\n");

    for (const line of lines) {
      const [key, ...value] = line.split(":").map((item) => item.trim());
      if (key && value.length > 0) {
        systemInfo[key] = value.join(":").trim();
      }
    }
    const formatedInfo = JSON.stringify(systemInfo, null, 2);*/
    const lines = stdout.split("\r\n").filter((line) => line.trim() !== "");
    const systemInfo = {};

    for (const line of lines) {
      const [key, value] = line.split(":").map((item) => item.trim());
      systemInfo[key] = value;
    }
    res.status(200).json(systemInfo);
  });
});

app.listen(PORT, (err) => {
  if (err) console.log("something is wrong", err);
  console.log(`Server is online at ${PORT}`);
});
