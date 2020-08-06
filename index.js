const express = require('express');
const body_parser = require('body-parser');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const mongoose = require('mongoose');
const lodash = require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

let deprecation_warning_items = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(process.env.MONGODB_LOCATION + '/todo_list_db', deprecation_warning_items);

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
    completed_date: Date
});

const Item = mongoose.model('item', items_schema);

app.get('/:list_title?', function(req, res) {
    let list_title = '';
    if (typeof(req.params.list_title) === 'undefined') {
        list_title = 'Today';
    } else {
        list_title = lodash.startCase(lodash.lowerCase(req.params.list_title))
    }
    Item.find({list: list_title, completed: false}, function(err, items) {
        if (err) {
            console.log(err);
        } else {
            let todo_items = items;
            res.render('list', {
                list_title: list_title,
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
    if (req.body.list === 'Today') {
        res.redirect('/');
    } else {
        res.redirect('/' + lodash.lowerCase(req.body.list));
    }
});

app.post('/completed', function(req, res) {
    const today = new Date();
    console.log(req.body.list);
    Item.updateOne(
        {_id: req.body.checkbox},
        {
            completed: true,
            completed_date: today
        },
        function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully marked as completed");
            }
    });
    if (req.body.list === 'Today') {
        res.redirect('/');
    } else {
        res.redirect('/' + lodash.lowerCase(req.body.list));
    }
});

app.listen(process.env.PORT, function() {
    console.log("Server started on port " + process.env.PORT);
});