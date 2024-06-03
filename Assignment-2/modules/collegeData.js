const fs = require('node:fs');

class Data{
    students;
    courses;

    constructor(setStudents = '', setCourses = ''){
        this.students = setStudents;
        this.courses = setCourses;
    }

}

var dataCollection = null;

var studentsfile = './data/students.json';
var coursesfile = './data/courses.json';

initialize = () => {

    function studentdatafromfile() {
        return new Promise (
            (resolve, reject) => {
                fs.readFile(studentsfile, 'utf8', (err, datafromfile) => {
                    if (err) {
                        reject(`unable to read ${studentsfile}`);
                        return;
                    }
                    let data = JSON.parse(datafromfile);
                    resolve(data);
                }

                )
            }
        )
    }

    function coursedatafromfile(msg) {
        return new Promise (
            (resolve, reject) => {
                fs.readFile(coursesfile, 'utf8', (err, datafromfile) => {
                    if (err) {
                        reject(`unable to read ${coursesfile}`);
                        return;
                    }
                    let data = JSON.parse(datafromfile);
                    resolve([msg, data]);
                }

                )
            }
        )
    }

    return new Promise (
        (resolve, reject) => {
            studentdatafromfile()
            .then(coursedatafromfile)
            .then( (final_data) => {
                dataCollection = new Data(final_data[0], final_data[1])
                console.log("Successful initialization")
                resolve(dataCollection)
            })
            .catch(function(errmsg) {
                reject(errmsg);
            });
        }
    )

}

function getAllStudents() {
    return new Promise(
        (resolve, reject) => {
            if (dataCollection.students.length > 0) {
                resolve(dataCollection.students);
            } else {
                reject("No students results returned");
            }
        }
    );
}

function getCourses() {
    return new Promise(
        (resolve, reject) => {
            if (dataCollection.courses.length > 0) {
                resolve(dataCollection.courses);
            } else {
                reject("No courses results returned");
            }
        }
    )
}

function getTAs() {
    return new Promise(
        (resolve, reject) => {
            let TAs = [];
            for ( var i = 0; i < dataCollection.students.length; i++ ) {
                if (dataCollection.students[i].TA) {
                    TAs.push(dataCollection.students[i])
                }
            }
            if (TAs.length > 0) {
                resolve(TAs)
            } else {
                reject("No TAs results returned")
            }
        }
    )
}

module.exports = {
    initialize,
    getAllStudents,
    getCourses,
    getTAs
}