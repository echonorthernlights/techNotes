const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

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

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT} ....`);
});
