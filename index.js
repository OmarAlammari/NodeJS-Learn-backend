const express = require('express');
const path = require('path');
const app = express();
const Ajv = require('ajv');
const helmet = require('helmet');
const ejs = require('ejs');

const cookieParser = require('cookie-parser');

app.use(cookieParser());

//3rd party middleware
app.use(helmet())


const schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "pattern": "^[A-Z][a-z]*$"
        },
        "dept": {
            "type": "string",
            "enum": ["SD", "SA", "MD"],
            "maxLength": 2,
            "minLength": 2
        },
    },
    "required": ["name", "dept"],
    "maxProperties": 2
};
const schema1 = {
    type: "object",
    properties: {
        name: {
            "type": "string",
            "pattern": "^[A-Z][a-z]*$"
        },
        dept: {
            "type": "string",
            "enum": ["SD", "SA", "MD"],
            "maxLength": 2,
            "minLength": 2
        },
    },
    required: ["name", "dept"],
    maxProperties: 2

    // additionalProperties: false
};
// let ajv = new Ajv();
// let ajv = new Ajv.default({ allErrors: true });
// var ajv = new Ajv({ allErrors: true });
// var ajv = new Ajv().compile(schema);    
// let validator =  ajv;
// let validator =  ajv.compile(schema);
let validator = new Ajv.default().compile(schema);

// built-in Middleware
app.use(express.urlencoded({ extended: false })); // Parse URL encoded payload

app.use(express.json());//Parse JSON sent body by clint throught request body

app.use(express.static("public"));// Static files (css,js,img,html...)
// app.use(express.static("/assets","public"));



//custom Middleware (Application Middleware)
//logging
app.use((req, res, nxt) => {


    nxt();
});
const port = process.env.PORT || 3000;

var Students = [
    { name: 'ali', dept: 'PD', id: 1 },
    { name: 'omar', dept: 'SD', id: 2 },
    { name: 'amran', dept: 'SA', id: 3 },
];

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

//parameter middleware    
app.param('id', (req, res, nxt, id) => {

    //validation of parameter
    if (Number(id)) {

        //add param as prop for req
        req.id = id;

        nxt();
    }
    else {
        res.send('invalid id');
    }
});

//passing data from clint to server via URL parameters
app.get('/api/students/:id', (req, res) => {
    // let id = req.params.id;
    // console.log(req.id);
    // console.log(req.params.id);
    let id = req.id;
    const std = Students.find((val, idx, arr) => { return val.id == id });
    if (std) {
        res.json(std);
    } else {
        res.send('not found');
    }
});

app.all('/api/students', (req, res, nxt) => {
    console.log("request recieved on students Collection...");
    nxt();
});

//app settings
app.set("template engine", "ejs");
// app.set("views", "templates");

//REquest all Students
app.get('/api/students', (req, res) => {

    res.set("Access-Control-Allow-Origin");
    // res.json(Students);
    res.render("Students.ejs", { std: Students });
});

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

// create new students
app.post('/api/students', (req, res) => {
    let valid = validator(req.body);
    // console.log(schema);
    console.log(valid);
    // req.body.id = Students.length + 1;
    // Students.push(req.body);
    // res.json(req.body);
    if (valid) {
        req.body.id = Students.length + 1;
        Students.push(req.body);
        res.json(req.body);
    }
    else {
        res.status(403).send('forbidden command');
        // res.sendStatus(403);
    }
});

// delete existing student
app.delete('/api/students/:id', (req, res) => {
    let idx = Students.findIndex((val) => val.id == req.params.id);
    if (idx != -1) {
        Students.splice(idx, 1);
        res.send('one element affected');
    } else {
        res.send('students not found');
    }
});

// update for student data
app.put('/api/students/:id', (req, res) => {
    let idx = Students.findIndex((val) => val.id == req.params.id);
    if (idx != -1) {
        for (i in req.body) {
            Students[idx][i] = req.body[i];
        }
        res.json(Students[idx]);
    }
    else {
        res.send('students not found.. update is not allowed');
    }
});

app.get('/abc', (req, res) => {
    console.log(Buffer.from(req.cookies.username, 'base64').toString());
    console.log(req.cookies.age);

    res.sendStatus(200);
});


app.listen(port, () => console.log('true'));