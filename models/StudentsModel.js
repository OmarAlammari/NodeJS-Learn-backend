const fs = require('fs');
const path = require('path');
const studentsPath = path.join(path.dirname(process.mainModule.filename), 'data', 'Students.json');


/* const Students = [
    { name: 'ali', dept: 'PD', id: 1 },{ name: 'omar', dept: 'SD', id: 2 }, { name: 'amran', dept: 'SA', id: 3 },
]; */

// var arrayStudents = [];

module.exports = class Student {

    constructor({ name: nm, dept }) {
        // constructor(nm, dept) {
        this.name = nm;
        this.dept = dept;
    }

    saveStudent() {
        // Students.push(this);
        //1)read from file
        fs.readFile(studentsPath, (err, info) => {
            let Students = [];
            if (!err) {
                Students = JSON.parse(info);
                this.id = Students.length + 1;

                //2)update data
                Students.push(this);

                //3)write info file
                fs.writeFile(studentsPath, JSON.stringify(Students), (err) => {
                    console.log(err);
                });
            }
        });
    }
    // static fetchAllStudents1() {
    //     this.fetchAllStudents();
    //     return arrayStudents;
    // }

    static fetchAllStudents(callback) {
        fs.readFile(studentsPath, (err, info) => {
            if (!err) {
                // console.log('fetchAllStudents no error');
                callback(JSON.parse(info));
                // arrayStudents = JSON.parse(info);
            }
            else{
                callback([]);
            }
        });
    }
}