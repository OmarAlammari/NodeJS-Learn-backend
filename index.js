const express = require('express');
const path = require('path');
const app = express();
const helmet = require('helmet');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');

const studentsRouter = require('./routes/Students');
const logging = require('./middleware/logging');



// built-in Middleware
app.use(express.json()); //Parse JSON sent body by clint throught request body

app.use(express.urlencoded({ extended: false })); // Parse URL encoded payload

app.use(express.static("public")); // Static files (css,js,img,html...)
// app.use(express.static("/assets","public"));

app.use(cookieParser());

//3rd party middleware
app.use(helmet())

//custom Middleware (Application Middleware)
//logging
app.use(logging);

app.use('/api/students',studentsRouter);

const port = process.env.PORT || 3000;


app.get('*', (req, res, nxt) => {
    console.log("get request recieved...");
    nxt();
});

// Route Handler Middleware
app.get('/',
    (req, res, next) => {
        //
        //
        next();
    },
    (req, res, next) => {
        //
        //
        console.log("stage #1");
        next();
    },
    (req, res) => {
        res.sendFile(path.join(__dirname, '/main.html'));
    });


//app settings
app.set("template engine", "ejs");
// app.set("views", "templates");


//Query String
app.get('/welcome.html', (req, res) => {
    console.log(req.query);
    console.log(req.query.fnm);
    console.log(req.query.lnm);

    res.sendFile(path.join(__dirname, '/welcome.html'));
});

//REQ body
app.post('/welcome.html', (req, res) => {
    console.log(req.body);

    // res.cookie("username", req.body.fnm);
    // res.cookie("user_age", 22);

    // with Encoded
    res.cookie("username", Buffer.from(req.body.fnm).toString('base64'));
    res.cookie("user_age", 22, { httpOnly: true });

    res.send(`thanks ${req.body.fnm} ${req.body.lnm} for sending required data`)
});

app.get('/abc', (req, res) => {
    console.log(Buffer.from(req.cookies.username, 'base64').toString());
    console.log(req.cookies.age);

    res.sendStatus(200);
});


app.listen(port, () => console.log('true'));