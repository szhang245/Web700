/*********************************************************************************
*  WEB700 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
*
*  Name: _Shuai Zhang_ Student ID: _136898236_ Date: _June 10, 2024_
*
********************************************************************************/
var HTTP_PORT = process.env.HTTP_PORT || 8080;
var express = require("express");
var path = require("path");
var app = express();
var collegeData = require("./modules/collegeData");

app.set('json spaces', 2)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
})

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
})

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
})

app.get("/students", (req, res) => {
    const course = parseInt(req.query.course);
    collegeData.getAllStudents()
    .then( (students) => {
        if(course) {
            collegeData.getStudentsByCourse(course)
            .then( (result) => {
                res.json(result);
            }
            )
            .catch( () => {
                res.json({
                    message: "no course results"
                })
            }
            )
        }
        else {
            res.json(students);
        }
    }
    )
    .catch( () => {
        res.json({
            message: "no results"
        })
    })
})

app.get('/student/:num', (req, res) => {
    const num = parseInt(req.params.num);
    collegeData.getStudentByNum(num)
    .then(
        (student) => {
            res.json(student);
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

app.get('/tas', (req, res) => {
    collegeData.getTAs()
    .then( (tas) => {
        res.json(tas);
    }
    )
    .catch( () => {
        res.json(
            {message: "no tas results"}
        )
    })
}
)

app.get('/courses', (req, res) => {
    collegeData.getCourses()
    .then( (courses) => {
        res.json(courses);
    }
    )
    .catch( () => {
        res.json(
            {message: "no courses results"}
        )
    })
}
)

app.all(
    '*', (req, res) => {
        res.status(404).send("Page Not THERE, Are you sure of the path?");
    }
)

collegeData.initialize()
.then( () => {
    app.listen(HTTP_PORT, () => {console.log("server listening on port: " + HTTP_PORT)});
}
)
.catch( err => {
    console.log*(err);
})