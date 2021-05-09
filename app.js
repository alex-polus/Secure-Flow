const express = require('express');
const bodyParser = require('body-parser');
const uuidAPIKey = require('uuid-apikey');
var ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(express.static("public"));

//Mongo DB
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mongo:Zjsxyks9!@cluster0.kxpu2.mongodb.net/testdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.get('/', (req, res) => {
    res.render('pages/container.ejs');
})

client.connect(err => {
    const users = client.db("testdb").collection("users");
    const containers = client.db("testdb").collection("containers");
    
    app.post('/container-creation', (req, res) => {
        var apiKey = req.body.apiKey;
        var key = req.body.key;
        var value = req.body.value;   
        
        var timestamp = new Date().toISOString();

        if (uuidAPIKey.isAPIKey(apiKey)) { // check if apiKey
            var uuid = uuidAPIKey.toUUID(apiKey); // converts to uuid

            // if the container already exists
            if (containers.findOne({"container-key": apiKey})) {
                var insertData = { key: key, value: value, "time": timestamp};
                containers.findOneAndUpdate({"user-key": apiKey}, {$push: {data: insertData}});
                res.render('pages/container.ejs', {message: 'Your data container already exists!'});
                console.log('Your data container already exists!');
            } else {
                // if the container DNE, but user apiKey exists
                if (users.findOne({uuid: uuid})) { // if user with this uuid exists
                    // TODO: implement ask user to authorize!

                    //1EEA6DC-JAM4DP2-PHVYPBN-V0XCJ9X
                    var containerKey = uuidAPIKey.create();

                    containers.insertOne({"user-key": apiKey, "container-key": containerKey.apiKey});
                    res.render('pages/container.ejs', {message: `successfully created container, please keep this key: ${containerKey.apiKey}`});
                    console.log(`Container created - key: ${containerKey.apiKey}`)
                } else {
                    res.render('pages/container.ejs', {message: "Incorrect API Key."});
                    console.log('No users with mentioned API Key');
                }
            }
        } else { // not a valid APIKey format
            res.render('pages/container.ejs', {message: "Incorrect API Key."});
            console.log('Wrong API Key');
        }
    })
    //client.close();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
