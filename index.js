const express = require('express');
const path = require('path');
const app = express();
const Ajv = require('ajv');

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
let validator =  new Ajv.default().compile(schema);
// let validator =  ajv.compile(schema);


app.use(express.urlencoded({ extended: false }));

app.use(express.json());

const port = process.env.PORT || 3000;

var Students = [
    { name: 'ali', dept: 'PD', id: 1 },
    { name: 'omar', dept: 'SD', id: 2 },
    { name: 'amran', dept: 'SA', id: 3 },
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/main.html'));
});

//passing data from clint to server via URL parameters
app.get('/api/students/:id', (req, res) => {
    let id = req.params.id;
    const std = Students.find((val, idx, arr) => { return val.id == id });
    if (std) {
        res.json(std);
    } else {
        res.send('not found');
    }

});

app.get('/api/students', (req, res) => {
    // let id = req.params.id;

    res.json(Students);
    // const std = Students.find((val, idx, arr) => { return val.id == id });
    // if (std) {
    //     res.json(std);
    // } else {
    //     res.send('not found');
    // }

});

//Query String
app.get('/welcome.html', (req, res) => {
    console.log(req.query);
    console.log(req.query.fnm);
    console.log(req.query.lnm);

    res.sendFile(path.join(__dirname, '/welcome.html'));
});

app.post('/welcome.html', (req, res) => {
    console.log(req.body);
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




app.listen(port, () => console.log('true'));