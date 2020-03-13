const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/notes', function (res, res) {
  res.sendFile(path.join(__dirname + '/public/notes.html'));
});

app.get('/api/notes', function (req, res) {
  fs.readFile(path.join(__dirname + '/db/db.json'),
    async(err, data) => {
      if (err) throw err;
    
      const ret = JSON.parse(data);
    
      res.send(ret);
    });
});

app.post('/api/notes', function (req, res) {
  fs.readFile(path.join(__dirname + '/db/db.json'),
    (err, data) => {
      if (err) throw err;
      let ret = JSON.parse(data);
      let newNote = req.body;
      let id
      if (ret.length) {
        id=ret[ret.length -1].id +1

      }
      else{id=0}
      newNote.id = id;
      ret.push(newNote);
      fs.writeFile(path.join(__dirname + '/db/db.json'),
        JSON.stringify(ret),
        (err) => {
          if (err) throw err;
        });
      res.send(ret);
    });
});

app.delete('/api/notes/:id', function (req, res) {
  console.log(req.params.id, 'this is id')
      const id = req.params.id; 
  fs.readFile(path.join(__dirname + '/db/db.json'),
    (err, data) => {
      if (err) throw err;
      const ret = JSON.parse(data);
      const filteredArray = ret.filter(x =>{
        console.log(x.id === parseInt(id), '<======') 
        return x.id !== parseInt(id)});
      fs.writeFile(path.join(__dirname + '/db/db.json'),
        JSON.stringify(filteredArray),
        (err) => {
          if (err) throw err;
          console.log(ret)
          res.send(ret);
        });
    });
});

app.listen(PORT, () => {
  console.log("server listening on localhost:" + PORT)
});