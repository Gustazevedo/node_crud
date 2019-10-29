const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const url = 'mongodb+srv://gustavo:opq198lt7m@cluster0-wyru1.mongodb.net/test?retryWrites=true&w=majority'

mongoClient.connect(url, (err, client) => {
  if (err) return console.log(err);
  db = client.db('cluster0');

  app.listen(3000, () => {
    console.log(`Server running on port 3000`);
  });
});

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');


app.route('/')
.get((req, res) => {
  const cursor = db.collection('data').find();
  res.render('index.ejs');
})
.post((req, res) => {
  db.collection('data').save(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log('Salvo no Banco de Dados');
    res.redirect('/show');
  })
});

app.route('/show')
.get((req, res) => {
  db.collection('data').find().toArray((err, results) => {
    if (err) return console.log(err);
    res.render('show.ejs', { data: results });
  });
})

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id;
  
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err);
    res.render('edit.ejs', {data: result});
  });
})
.post((req, res) => {
  var id = req.params.id;
  var product = req.body.product;
  var quantity = req.body.quantity;
  
  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      product: product,
      quantity: quantity
    }
  }, (err, result) => {
    if (err) return res.send(err);
    res.redirect('/show');
    console.log('Atualizado no Banco de dados');
  });
});

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id;

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err);
    console.log('Deletado do Banco de dados');
    res.redirect('/show');
  });
});