const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: [
      "set-cookie",
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ],
  })
);

// this is the default path, go to localhost:5000 on your browser to check if your server is running
app.get("/", (req, res) => {
  res.json({ Message: "Server is up and running" });
});

// this is the login path
app.post("/login", (req, res) => {
  const id = req.body?.id;
  const password = req.body?.password;
  const authToken = jsonwebtoken.sign({ id, password }, "DUMMYKEY");

  // now we will be setting cookies from server side only.
  // below cookie is httpOnly, its maxAge is 1 day
  // This cookie is valid to all the path in the domain
  res.cookie("authToken", authToken, {
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.sendStatus(200);
});

// this path will be used to check if the cookie is valid to auto login inside the application;
app.get("/autoLogin", (req, res) => {
  const cookie = req.headers.cookie;

  // if we received no cookies then user needs to login.
  if (!cookie || cookie === null) {
    return res.sendStatus(401);
  }

  console.log(cookie["authToken"]);

  return res.sendStatus(200);
});

// this path will be used to check if the cookie is valid to auto login inside the application;
app.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  return res.sendStatus(200);
});

app.listen(5000, () => console.log("Backend Running on Port 5000"));
