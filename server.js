const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;
const { text } = require('express');
const express = require('express');
const { writeFile } = require('fs');
const fs = require('fs/promises');
const path = require('path');
const app = express();

app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html')),
);

app.get('/api/notes', (req, res) =>
res.sendFile(path.join(__dirname, './db/db.json')),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  const newNotes = {
    title,
    text,
    id: uuidv4(),
  };
  fs.readFile('./db/db.json', 'utf8').then(file => {
    console.log(file);
    let parsedArr = JSON.parse(file);
    parsedArr.push(newNotes);
    fs.writeFile('./db/db.json', JSON.stringify(parsedArr)).then(() =>
      res.json(newNotes),
    );
  });
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html')),
);

app.listen(PORT, () =>
  console.log(`App is listening at http://localhost:${PORT}`),
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