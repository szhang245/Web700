/*********************************************************************************
*  WEB700 – Assignment 6
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
*
*  Name: _Shuai Zhang_ Student ID: _136898236_ Date: _July 21, 2024_
*  
*  Online (Heroku) Link: https://web700-assign5-70cbe2c0afbe.herokuapp.com/students
*
********************************************************************************/
//var HTTP_PORT = process.env.HTTP_PORT || 8080;
var HTTP_PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var app = express();
var collegeData = require("./modules/collegeData");

app.set('json spaces', 2);

//Set Handlebar Template engine to express server
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
            },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
            }
    },
    layout: 'main'
}));

app.set('view engine', '.hbs');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo")
});

app.get("/students/add", (req, res) => {
    collegeData.getCourses()
    .then( (data) => {
        res.render("addStudent", {courses: data})
    })
    .catch( (err) => {
        res.render("addStudent", {courses: []})
    })
});

app.get('/courses/add', (req, res) => {
    res.render("addCourse")
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
    .then( () => {
        res.redirect('/students')
    })
});

app.post("/courses/add", (req, res) => {
    collegeData.addCourse(req.body)
    .then( () => {
        res.redirect('/courses')
    })
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
    .then( () => {
        console.log(req.body);
        res.redirect("/students");
    })
    .catch( (err) => {
        console.log(err);
    }
    )
    }
);

app.post("/course/update", (req, res) => {
    collegeData.updateCourse(req.body)
    .then( () => {
        console.log(req.body);
        res.redirect("/courses");
    })
    .catch( (err) => {
        console.log(err);
    }
    )
    }
);

app.get("/students", (req, res) => {
    const course = parseInt(req.query.course);
    collegeData.getAllStudents()
    .then( (data) => {
        if(course) {
            collegeData.getStudentsByCourse(course)
            .then( (data) => {
                if (data.length > 0) {
                    res.render("students", {students: data});
                } else {
                    res.render("students",{ message: "no results" });
                };
            }
            )
            .catch( () => {
                res.render("students", {message: "no results"});
            }
            )
        }
        else {
            if (data.length > 0) {
                res.render("students", {students: data});
            } else {
                res.render("students",{ message: "no results" });
            };
        }
    }
    )
    .catch( (err) => {
        res.render("students", {message: "no results"});
    })
})

app.get('/student/:studentNum', (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};
    collegeData.getStudentByNum(req.params.studentNum)
    .then( (data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    })
    .catch( () => {
        viewData.student = null; // set student to null if there was an error
    })
    .then(collegeData.getCourses)
    .then( (data) => {
        viewData.courses = data; // store course data in the "viewData" object as "courses"
        // loop through viewData.courses and once we have found the courseId that matches
        // the student's "course" value, add a "selected" property to the matching
        // viewData.courses object
        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }
    })
    .catch( () => {
        viewData.courses = []; // set courses to empty if there was an error
    })
    .then( () => {
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); // render the "student" view
        }
    });
});

app.get('/courses', (req, res) => {
    collegeData.getCourses()
    .then( (data) => {
        if (data.length > 0) {
            res.render("courses", {courses: data});
        } else {
            res.render("courses",{ message: "no results" });
        };
    }
    )
    .catch( () => {
        res.render("courses", {message: "no results"});
    })
}
);

app.get('/course/:id', (req, res) => {
    const id = parseInt(req.params.id);
    collegeData.getCourseById(id)
    .then(
        (data) => {
            if (data) {
                res.render("course", {course: data});
            } else {
                res.status(404).send("Course Not Found")
            }
        }
    )
    .catch( () => {
        res.render("course", {message: "no result"});
    }
    )
}
);

app.get('/course/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    collegeData.deleteCourseById(id)
    .then( () => {
        res.redirect('/courses')
    })
    .catch( () => {
        res.status(500).send("Unable to Remove Course / Course not found)")
    })
});

app.get('/student/delete/:studentNum', (req, res) => {
    const id = parseInt(req.params.studentNum);
    collegeData.deleteStudentByNum(id)
    .then( () => {
            res.redirect('/students')
        }
    )
    .catch( () => {
        res.status(500).send("Unable to Remove Student / Student not found)")
    })
});

app.use((req, res) => {
    res.status(404).send("Page Not THERE, Are you sure of the path?");
});

collegeData.initialize()
.then( () => {
    app.listen(HTTP_PORT, HOST, () => {console.log("server listening on port: " + HTTP_PORT)});
}
)
.catch( err => {
    console.log*(err);
})