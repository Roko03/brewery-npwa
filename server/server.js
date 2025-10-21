require("dotenv/config");
require("express-async-errors");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/connectDB");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const authRouter = require("./router/auth");
const usersRouter = require("./router/user");
const producersRouter = require("./router/producers");
const beerColorRouter = require("./router/beer/beerColor");
const beerTypeRouter = require("./router/beer/beerType");
const beerRouter = require("./router/beer/beer");
const favoritesRouter = require("./router/favorites");

const authenticationUser = require("./middleware/authentication");
const roleAuthentication = require("./middleware/role-authentication");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("Ej");
});

app.use("/api/v1/auth", authRouter);

app.use(
  "/api/v1/users",
  authenticationUser,
  roleAuthentication(["ADMIN"]),
  usersRouter
);

app.use(
  "/api/v1/producers",
  authenticationUser,
  roleAuthentication(["ADMIN"]),
  producersRouter
);

app.use("/api/v1/beer-color", authenticationUser, beerColorRouter);

app.use("/api/v1/beer-type", authenticationUser, beerTypeRouter);

app.use("/api/v1/beer", authenticationUser, beerRouter);

app.use("/api/v1/favorites", authenticationUser, favoritesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = Number(process.env.PORT) || 3000;

const server = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

server();
