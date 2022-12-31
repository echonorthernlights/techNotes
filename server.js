const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
});
app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT} ....`);
});