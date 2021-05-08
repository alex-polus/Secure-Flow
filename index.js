var express = require('express');

var app = express();
var bodyParser = require('body-parser');
const { Double } = require('bson');
const { exists } = require('fs');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(express.static("public"));

var mongoose = require('mongoose');

var mongoAtlasUri = 'mongodb+srv://mongo:<password>@cluster0.kxpu2.mongodb.net/testdb?retryWrites=true&w=majority';
try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log(" Mongoose is connected")
    );

  } catch (e) {
    console.log("could not connect");
  }



app.get('/', (req, res) => {
    res.render('index');
})

app.post('/handle', (req, res) => {
    var apiKey = req.body.apiKey;
    var item = req.body.item;

    
       
    

    console.log(req.body);
    
})
/*
app.get('/', (req, res) => {
    //res.send("ToHack2021");
    res.render('index');
    //res.render("index", { task: task, complete: complete });
})
*/


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})


// =================================================== //

/*
 *** Task (Service -> server)
 *** POST ROUTE for public key authenticate

    <form action ="/submit" method="POST">
    <input type="text" name="apiKey" placeholder="Enter Public Key">
    <input type="text" name="item" placeholder="Enter Public Key">

*/

/*
var apiKey = req.body.apiKey;
var item = req.body.item;
// other fields (+)
// other fields (drop down / user input)

if (uuidAPIKey.isAPIKey(apiKey)) { // check if apiKey
    var uuid = uuidAPIKey.toUUID(apiKey); // converts to uuid
} else {
    // throw exception 
}

//Mongo.connect('mongodb://ATLAS-LINK', function(err, db) {
//if(err) throw err;
var collection = db.collection('collection_name');

// public key exist
collection.findOne({uuid : uuid}, (err,doc) => {
    if(err) throw err;
    if(doc) 
        // logic for sending form 
        console.log(doc.userName + " " + doc.lastName + " ");

        var requestedItems = [];
        for (var i=0; i<Object.item.length; i++) {
            requestedItems.push({item: data.item})
        }

    else
        // throw warning that Key DNE
    db.close();
});

*/


