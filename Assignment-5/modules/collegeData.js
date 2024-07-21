const Sequelize = require('sequelize');
require('dotenv').config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

var sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    },
    query:{ raw: true }
});


initialize = () => {

    return new Promise(
        (resolve, reject) => {
            sequelize.sync()
            .then( (res) => {
                resolve(res)
            }
            )
            .catch( (err) => {
                reject("unable to sync the database")
            })
        }
    );

}

function getAllStudents() {
    return new Promise(
        (resolve, reject) => {
            Student.findAll()
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject("no results returned")
            })
        }
    );
}

function getCourses() {
    return new Promise(
        (resolve, reject) => {
            Course.findAll()
            .then( (res) =>{
                resolve(res)
            })
            .catch( (err) => {
                reject("no results returned")
            })
        }
    );
}

function getStudentsByCourse(course) {
    return new Promise(
        (resolve, reject) => {
            Student.findAll({
                where: {
                    course: course
                }
            })
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject("no results returned")
            })
        }
    );
}

function getStudentByNum(num) {
    return new Promise(
        (resolve, reject) => {
            Student.findOne({
                where: {
                    studentNum: num
                }
            })
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject("no results returned")
            })
        }
    );
}

function getCourseById(id) {
    return new Promise(
        (resolve, reject) => {
            Course.findOne({
                where: {
                    courseId: id
                }
            })
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject("no results returned")
            })
        }
    );
}

function addStudent(studentData) {
    return new Promise(
        (resolve, reject) => {
            studentData.TA = (studentData.TA) ? true : false;
            for (const key in studentData) {
                if (studentData.key === "" ) {
                    studentData.key = null;
                };
              };
            
            Student.create({
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                addressStreet: studentData.addressStreet,
                addressCity: studentData.addressCity,
                addressProvince: studentData.addressProvince,
                TA: studentData.TA,
                status: studentData.status,
                course: studentData.course
            })
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject("unable to create student")
            })
        }
    );
}

function addCourse(courseData) {
    return new Promise(
        (resolve, reject) => {
            for (const key in courseData) {
                if (courseData.key === "" ) {
                    courseData.key = null;
                };
              };
            
              Course.create({
                courseCode: courseData.courseCode,
                courseDescription: courseData.courseDescription
              })
              .then( (res) => {
                resolve(res)
              })
              .catch( (err) => {
                reject("unable to create course")
              })
        }
    )
}

function updateStudent(studentData) {
    return new Promise(
        (resolve, reject) => {
            studentData.TA = (studentData.TA) ? true : false;
            for (const key in studentData) {
                if (studentData.key === "" ) {
                    studentData.key = null;
                };
              };
            
            Student.update({
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                addressStreet: studentData.addressStreet,
                addressCity: studentData.addressCity,
                addressProvince: studentData.addressProvince,
                TA: studentData.TA,
                status: studentData.status,
                course: studentData.course
            }, {
                where: {
                    studentNum: studentData.studentNum
                }
            })
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject("unable to update student")
            })
        }
    );
}

function updateCourse(courseData) {
    return new Promise(
        (resolve, reject) => {
            for (const key in courseData) {
                if (courseData.key === "" ) {
                    courseData.key = null;
                };
              };
            
            Course.update({
                courseCode: courseData.courseCode,
                courseDescription: courseData.courseDescription
            }, {
                where: {
                    courseId: courseData.courseId
                }
            })
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject("unable to update course")
            })
        }
    )
}

function deleteCourseById(id) {
    return new Promise(
        (resolve, reject) => {
            Course.destroy({
                where: {
                    courseId: id
                }
            })
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject(err)
            })
        }
    )
}

function deleteStudentByNum(studentNum) {
    return new Promise(
        (resolve, reject) => {
            Student.destroy({
                where: {studentNum: studentNum}
            })
            .then( (res) => {
                resolve(res)
            })
            .catch( (err) => {
                reject(err)
            })
        }
    )
};

var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false
}
);

var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false
}
);

Course.hasMany(Student, {foreignKey: 'course'});

module.exports = {
    initialize,
    getAllStudents,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent,
    getCourseById,
    updateStudent,
    addCourse,
    updateCourse,
    deleteCourseById,
    deleteStudentByNum
}