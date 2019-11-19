const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
    dest: './public/images/',
    limits: {
        fileSize: 10000000
    }
});

const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/online_store', {
    useNewUrlParser: true
});

// Create a scheme for items.
const itemSchema = new mongoose.Schema({
    title: String,
    price: Number,
    path: String,
    numPurchased: {
        type: Number,
        default: 0
    }
});
// Create a model for items
const Item = mongoose.model('Item', itemSchema);

// Upload a photo.
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.sendStatus(400);
    }
    res.send({
        path: "/images/" + req.file.filename
    });
});

// Get a list of all of the items
app.get('/api/items', async (req, res) => {
    try {
        let items = await Item.find();
        res.send(items);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Create a new item
app.post('/api/items', async (req, res) => {
    const item = new Item({
        title: req.body.title,
        price: req.body.price,
        path: req.body.path,
    });
    try {
        await item.save();
        res.send(item);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//Update an item purchased count
app.put('/api/purchased/:id', async (req, res) => {
    let item;
    try {
        item = await Item.findOne({
            _id: req.params.id
        });
    } catch (error) {
        console.log("findOne()\n", error);
        res.sendStatus(500);
    }
    item.numPurchased++;
    try {
        await item.save();
        res.send(item);
    } catch (error) {
        console.log("save()", error);
        res.sendStatus(500);
    }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        await Item.deleteOne({
                _id: req.params.id
            },
            error => {
                res.send("No item found");
            });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));