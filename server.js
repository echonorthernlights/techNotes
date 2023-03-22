require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const { connectDB } = require("./config/connectDB");
const userRouter = require("./routes/userRoutes");

const PORT = process.env.PORT || 5000;
//Middleware
// logger
app.use(logger);

//CORS policy
app.use(cors(corsOptions));
//Express json parser
app.use(express.json());
//Static files
app.use("/", express.static(path.join(__dirname, "public")));
//Routers
app.use("/users/api", userRouter);
// Error handling URL
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "Not Found !!" });
  } else {
    res.type("txt").send("Not Found !!!");
  }
});
//Error middleware
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    //Listen to PORT
    app.listen(PORT, () => {
      console.log(`Server running on PORT : ${PORT} ....`);
    });
  } catch (error) {
    console.log(`Server error : ${error}`);
  }
};

start();
