require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlingMiddleware = require("./middleware/error-handler");
const productsRouter = require("./routes/products");
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send(`<h1>Store Api </h1>`);
});

app.use("/api/v1/products", productsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlingMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to db ...");
    app.listen(
      port,
      console.log(`Server started successfully on port ${port}....`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
