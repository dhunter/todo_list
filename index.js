const express = require('express');
const body_parser = require('body-parser');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

let deprecation_warning_items = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(process.env.MONGODB_LOCATION + '/todo_list_db', deprecation_warning_items);

const today = new Date();
const options = {
    month: 'long', // June
    day: 'numeric', // 11
    year: 'numeric' // 2020 
}
const day = today.toLocaleDateString('en-US', options);

const items_schema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    list: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completed_date: String
});

const Item = mongoose.model('item', items_schema);

app.get('/', function(req, res) {
    Item.find({list: day, completed: false}, function(err, items) {
        if (err) {
            console.log(err);
        } else {
            let todo_items = items;
            res.render('list', {
                list_title: day,
                todo_items: todo_items
            });
        }
    });
});

app.get('/work', function(req, res) {
    Item.find({list: "Work List"}, function(err, items) {
        if (err) {
            console.log(err);
        } else {
            let todo_items = items;
            res.render('list', {
                list_title: "Work List",
                todo_items: todo_items
            });
        }
    });
});

app.post('/', function(req, res) {
    const add_item = new Item ({
        name: req.body.new_item,
        list: req.body.list
    });
    add_item.save();

    if (req.body.list === "Work List") {
        res.redirect('/work');
    } else {
        res.redirect('/');
    }
});

app.post('/completed', function(req, res) {
    console.log(req.body.checkbox);
    Item.updateOne(
        {_id: req.body.checkbox},
        {
            completed: true,
            completed_date: day
        },
        function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully marked as completed");
            }
    });
    res.redirect('/');
});

app.listen(process.env.PORT, function() {
    console.log("Server started on port " + process.env.PORT);
});