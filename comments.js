//Create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var comments = require('./comments.json');
var _ = require('lodash');

app.use(express.static(__dirname + '/public'));

app.get('/comments', function (req, res) {
    res.send(comments);
});

app.post('/comments', jsonParser, function (req, res) {
    var newComment = req.body;
    newComment.id = Date.now();
    comments.push(newComment);
    fs.writeFile('./comments.json', JSON.stringify(comments, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            res.send(newComment);
        }
    });
});

app.put('/comments/:id', jsonParser, function (req, res) {
    var comment = _.find(comments, function (comment) {
        return comment.id == req.params.id;
    });
    if (comment) {
        var updatedComment = req.body;
        updatedComment.id = comment.id;
        var index = _.indexOf(comments, comment);
        comments.splice(index, 1, updatedComment);
        fs.writeFile('./comments.json', JSON.stringify(comments, null, 4), function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send(updatedComment);
            }
        });
    } else {
        res.send('No comment with that id');
    }
});

app.delete('/comments/:id', function (req, res) {
    var comment = _.find(comments, function (comment) {
        return comment.id == req.params.id;
    });
    if (comment) {
        var index = _.indexOf(comments, comment);
        comments.splice(index, 1);
        fs.writeFile('./comments.json', JSON.stringify(comments, null, 4), function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send('Comment deleted');
            }
        });
    } else {
        res.send('No comment with that id');
    }
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});