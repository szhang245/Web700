/*********************************************************************************
*  WEB700 – Assignment 5
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
*
*  Name: _Shuai Zhang_ Student ID: _136898236_ Date: _July 15, 2024_
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
})

app.get("/about", (req, res) => {
    res.render('about');
})

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo")
})

app.get("/students/add", (req, res) => {
    res.render("addStudent")
})

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
    .then( () => {
        res.redirect('/students')
    }

    )
})

app.get("/students", (req, res) => {
    const course = parseInt(req.query.course);
    collegeData.getAllStudents()
    .then( (students) => {
        if(course) {
            collegeData.getStudentsByCourse(course)
            .then( (students) => {
                res.render("students", {students: students});
            }
            )
            .catch( () => {
                res.render("students", {message: "no results"});
            }
            )
        }
        else {
            res.render("students", {students: students});
        }
    }
    )
    .catch( () => {
        res.render("students", {message: "no results"});
    })
})

app.get('/student/:num', (req, res) => {
    const num = parseInt(req.params.num);
    collegeData.getStudentByNum(num)
    .then(
        (data) => {
            res.render("student", { student: data });
        }
    )
    .catch( () => {
        res.json(
            {message: "no student results"}
        )
    }
    )
}
)

app.get('/courses', (req, res) => {
    collegeData.getCourses()
    .then( (courses) => {
        res.render("courses", {courses: courses});
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
            res.render("course", {course: data});
        }
    )
    .catch( () => {
        res.render("course", {message: "no result"});
    }
    )
}
);

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

app.all(
    '*', (req, res) => {
        res.status(404).send("Page Not THERE, Are you sure of the path?");
    }
);

collegeData.initialize()
.then( () => {
    app.listen(HTTP_PORT, HOST, () => {console.log("server listening on port: " + HTTP_PORT)});
}
)
.catch( err => {
    console.log*(err);
})