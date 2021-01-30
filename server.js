const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const sessions = {};

const refresh = (sessionCode) => {
  const session = sessions[sessionCode];

  if (session) {
    io.to(sessionCode).emit('refresh session', {
      members: Object.values(session.members).map((member) => ({
        name: member.name,
        role: member.role,
        vote: session.revealed ? member.vote : !!member.vote,
      })),
      revealed: session.revealed,
    });
  } else {
    console.log(`ERROR: Session [${sessionCode}] does not exist`);
  }
};

io.on('connection', (socket) => {
  console.log(`INFO: Socket [${socket.id}] connecting...`);
  /**
   * Create Session
   *
   * Creates a new session with default values
   */
  socket.on('create session', (callback) => {
    // Generate session code
    const sessionCode = Math.floor(100000 + Math.random() * 900000);

    console.log(
      `INFO: Socket [${socket.id}] creating session [${sessionCode}]`
    );

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
  socket.on('join session', (name, role, sessionCode, callback) => {
    console.log(`INFO: Socket [${socket.id}] joining session [${sessionCode}]`);

    const session = sessions[sessionCode];
    if (session) {
      session.members[socket.id] = { name, role, vote: null };
      socket.join(sessionCode);
      refresh(sessionCode);
    } else {
      console.log(`ERROR: Session [${sessionCode}] does not exist`);
      callback();
    }
  });

  socket.on('vote', (vote, sessionCode) => {
    console.log(
      `INFO: Socket [${socket.id}] voting [${vote}] in session [${sessionCode}]`
    );

    const session = sessions[sessionCode];
    if (session) {
      session.members[socket.id].vote = vote;
      refresh(sessionCode);
    }
  });

  socket.on('reset', (sessionCode) => {
    console.log(
      `INFO: Socket [${socket.id}] resetting session [${sessionCode}]`
    );

    const session = sessions[sessionCode];
    if (session) {
      session.revealed = false;
      Object.values(session.members).forEach((member) => {
        member.vote = null;
      });
      refresh(sessionCode);
    }
  });

  socket.on('reveal', (sessionCode) => {
    console.log(
      `INFO: Socket [${socket.id}] revealing votes in session [${sessionCode}]`
    );

    const session = sessions[sessionCode];
    if (session) {
      session.revealed = true;
      refresh(sessionCode);
    }
  });

  /**
   * Disconnect
   *
   * Clean up the sessions
   */
  socket.on('disconnect', () => {
    console.log(`INFO: Socket [${socket.id}] disconnecting...`);

    Object.values(sessions).forEach((session) => {
      delete session.members[socket.id];
      if (Object.keys(session.members).length === 0) {
        delete session;
      }
    });
  });
});

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
