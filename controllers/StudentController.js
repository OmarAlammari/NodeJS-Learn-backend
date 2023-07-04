const validator = require('../util/StudentsValidator');
const Student = require('../models/StudentsModel');


const getAllStudents = (req, res) => {

    res.set("Access-Control-Allow-Origin");
    Student.fetchAllStudents((obj) => {
        console.log(obj);
        res.render("Students.ejs", { std: obj });
    });
    // res.json(new Student().fetchAllStudents() );
    // const li = Student.fetchAllStudents();
    // res.json(li);
    // console.log(li);
    // console.log(Student.fetchAllStudents());
};
const getStudentById = (req, res) => {
    // let id = req.params.id;
    // console.log(req.id); == console.log(req.params.id);
    let id = req.id;
    const std = Students.find((val, idx, arr) => { return val.id == id });
    if (std) {
        res.json(std);
    } else {
        res.send('not found');
    }
};
const createStudent = (req, res) => {
    let valid = validator(req.body);
    console.log(valid);
    if (valid) {
        // req.body.id = Students.length + 1;
        // Students.push(req.body);
        let std = new Student(req.body);
        // let std = new Student(req.body.name, req.body.dept);
        std.saveStudent();

        res.json(req.body);
    }
    else {
        res.status(403).send('forbidden command');
        // res.sendStatus(403);
    }
};
const deleteStudent = (req, res) => {
    let idx = Students.findIndex((val) => val.id == req.params.id);
    if (idx != -1) {
        Students.splice(idx, 1);
        res.send('one element affected');
    } else {
        res.send('students not found');
    }
};
const updateStudent = (req, res) => {
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
};


module.exports = {
    getAllStudents, getStudentById, createStudent,
    deleteStudent, updateStudent
};