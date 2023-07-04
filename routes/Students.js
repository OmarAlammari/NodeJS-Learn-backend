const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController')

router.all('/', (req, res, nxt) => {
    console.log("request recieved on students Collection...");
    nxt();
});

//REquest all Students
router.get('/', StudentController.getAllStudents);

//parameter middleware    
router.param('id', (req, res, nxt, id) => {

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
router.get('/:id', StudentController.getStudentById);

// create new students
router.post('/', StudentController.createStudent);

// delete existing student
router.delete('/:id', StudentController.deleteStudent);

// update for student data
router.put('/:id', StudentController.updateStudent);

module.exports = router;
