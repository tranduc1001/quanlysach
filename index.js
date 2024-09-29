require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

app.use(express.static(path.join(__dirname, 'views','layout','assets')));

app.listen(PORT, () =>{
    console.log(`Server started at http://localhost:${PORT}`);
})

mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;

db.on("erro",(error) => console.error("MonggoDB connection error:",error));
db.once("open",() => console.log("Connected to the database!"));

app.use(express.urlencoded({ extended:false }));
app.use(express.json());

app.use(
    session({
        secret:"100177",
        saveUninitialized:true,
        resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.set('view engine', 'ejs');

app.use("", require("./routes/routes"));

app.use(express.static("upload"));

