const express = require("express");
const cors = require("cors");
const path = require("path");
const expressSession = require("express-session");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const dbService = require("./services/db-service");

const session = expressSession({
  secret: "coding is amazing",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

app.use(express.json());
app.use(session);
app.use(express.static('public'))

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")));
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:8080",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

const authRoutes = require("./api/auth/auth-routes");
const userRoutes = require("./api/user/user-routes");
const stayRoutes = require("./api/stay/stay-routes");
const orderRoutes = require("./api/order/order-routes");
const { connectSockets } = require("./services/socket-service.js");
connectSockets(http, session);

const setupAsyncLocalStorage = require("./middlewares/setupAls-middleware");
app.all("*", setupAsyncLocalStorage);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stay", stayRoutes);
app.use("/api/order", orderRoutes);

app.get("/**", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const logger = require("./services/logger-service");
const port = process.env.PORT || 3030;

const bootstrap = async () => {
  await dbService.connect();
  http.listen(port, () => {
    logger.info("Server is running on port: " + port);
    console.log(`http://localhost:${port}/api/`);
  });
};

bootstrap();
