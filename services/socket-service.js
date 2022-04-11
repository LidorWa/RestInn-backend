const asyncLocalStorage = require("./als-service");
const logger = require("./logger-service");

var gIo = null;
let gUserSocket = [];

function connectSockets(http, session) {
  gIo = require("socket.io")(http, {
    cors: {
      origin: "*",
    },
  });
  gIo.on("connection", (socket) => {
    console.log("New socket", socket.id);
    gUserSocket.push({ socketId: socket.id });
    socket.on("log out", () => {
      socket.leave(socket.userId);
    });
    socket.on("logged in", (id) => {
      if (socket.userId) socket.leave(socket.userId);
      socket.join(id);
      socket.userId = id;
    });

    socket.on("update status", (order) => {
      console.log("Buyer: ", order.buyer._id);
      socket.broadcast.to(order.buyer._id).emit("status updated", order);
    });

    socket.on("new order", (order) => {
      console.log(order);
      socket.broadcast.to(order.hostId).emit("added order", order);
    });
    // socket.on("enter my-trips", (id) => {
    //   if (socket.userId) socket.leave(id);
    //   socket.join(id);
    //   socket.userId = id;
    // });

    socket.on("chat newMsg", (msg) => {
      console.log("Emitting Chat msg", msg);
      gIo.to(socket.myTopic).emit("chat addMsg", msg);
    });
    socket.on("user-watch", (userId) => {
      socket.join("watching:" + userId);
    });
    socket.on("set-user-socket", (userId) => {
      logger.debug(`Setting (${socket.id}) socket.userId = ${userId}`);
      socket.userId = userId;
    });
    socket.on("unset-user-socket", () => {
      delete socket.userId;
    });
  });
}

function emitTo({ type, data, label }) {
  if (label) gIo.to("watching:" + label).emit(type, data);
  else gIo.emit(type, data);
}

async function emitToUser({ type, data, userId }) {
  logger.debug("Emiting to user socket: " + userId);
  const socket = await _getUserSocket(userId);
  if (socket) socket.emit(type, data);
  else {
    console.log("User socket not found");
    _printSockets();
  }
}

// Send to all sockets BUT not the current socket
async function broadcast({ type, data, room = null, userId }) {
  console.log("BROADCASTING", JSON.stringify(arguments));
  const excludedSocket = await _getUserSocket(userId);
  if (!excludedSocket) {
    // logger.debug('Shouldnt happen, socket not found')
    // _printSockets();
    return;
  }
  logger.debug("broadcast to all but user: ", userId);
  if (room) {
    excludedSocket.broadcast.to(room).emit(type, data);
  } else {
    excludedSocket.broadcast.emit(type, data);
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets();
  const socket = sockets.find((s) => s.userId == userId);
  return socket;
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets();
  return sockets;
}

async function _printSockets() {
  const sockets = await _getAllSockets();
  console.log(`Sockets: (count: ${sockets.length}):`);
  sockets.forEach(_printSocket);
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`);
}

module.exports = {
  connectSockets,
  emitTo,
  emitToUser,
  broadcast,
};
