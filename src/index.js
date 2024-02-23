const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const router = require("./router");
const connectToDB = require("./db/connectToDB");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 8080;

const app = express();
app.use(morgan("combined"));
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie-parser
app.use(cookieParser());
// static file
app.use(express.static(path.join(__dirname, "public")));

// cors
const corsOption = {
    origin: "*",
};
app.use(cors(corsOption));

// connect to server
connectToDB();

router(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
