const express = require("express");
const fs = require('fs/promises');
const { text } = require("express");
const { writeFile } = require("fs");
const path = require("path");
const app = express();
let db = require("./db/db.json")

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));

app.get("/api/notes", function(req, res) {
    console.log(db)
    res.json(db)
    fs.readFile("db/db.json", function(data) {
        console.log(data)
        var notes = [].concat(JSON.parse(data))
         console.log(notes)
    })
});

app.post("/api/notes", function(req, res) {
       const note = {
        title: req.body.title,
        text: req.body.text,
        };
       note.id = db.length + 1
       db.push(note);
        res.json(db);
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.listen(PORT, () =>
console.log(`App listening at https://localhost.com:${PORT}`)
);

app.delete('/api/notes/:id', (req, res) => {
    let notesToDelete = req.params.id;
  
    fs.readFile(__dirname + '/db/db.json', 'utf8').then((data, err) => {
      if (err) {
        throw err;
      }
      let json = JSON.parse(data);
      console.log('BEFORE', json);
  
      for (let i = 0; i < json.length; i++) {
        if (json[i].id === notesToDelete) {
          json.splice(i, 1);
        }
      }
  
      console.log('LAST', json);
      fs.writeFile('./db/db.json', JSON.stringify(json)).then(() => {
        res.json({ ok: true });
      });
    });
  });