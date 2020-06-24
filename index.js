const express = require('express');
const body_parser = require('body-parser');
const dotenv = require('dotenv').config();
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

let items = [];
let work_items = [];

app.get('/', function(req, res) {
    const today = new Date();
    const options = {
        weekday: "long", // Thursday
        month: "long", // June
        day: "numeric" // 11
    }
    const day = today.toLocaleDateString('en-US', options);

    res.render('list', {
        list_title: day,
        items: items
    });
});

app.post('/', function(req, res) {
    console.log(req.body);
    let item = req.body.new_item;
    if (req.body.list === "Work List") {
        work_items.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect('/');
    }
});

app.get('/work', function(req, res) {
    res.render("list", {
        list_title: "Work List",
        items: work_items
    })
})

app.listen(process.env.PORT, function() {
    console.log("Server started on port " + process.env.PORT);
});