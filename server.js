const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

const sessions = {};

io.on("connection", (socket) => {
  console.log("New connection...", socket.id);

  /**
   * Create Session
   *
   * Creates a new session with default values
   */
  socket.on("create session", (callback) => {
    console.log(sessions);

    // Generate session code
    const sessionCode = Math.floor(100000 + Math.random() * 900000);

    // Add new session to list of sessions
    sessions[sessionCode] = {
      members: {},
      revealed: false,
    };

    // Send the session code to the client to notify that the
    // session has been created
    callback(sessionCode);
  });

  /**
   * Join Session
   *
   * Adds the client to the session
   */
  socket.on("join session", (name, role, sessionCode) => {
    console.log(sessions);

    if (sessions[sessionCode]) {
      sessions[sessionCode].members[socket.id] = { name, role, vote: null };
      socket.join(sessionCode);
      io.to(sessionCode).emit("refresh session", sessions[sessionCode]);
    }
  });

  /**
   * Disconnect
   *
   * Clean up the sessions
   */
  socket.on("disconnect", () => {
    Object.values(sessions).forEach((session) => {
      delete session.members[socket.id];
      if (Object.keys(session.members).length === 0) {
        delete session;
      }
    });

    console.log(sessions);
  });
});

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
