const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = 5000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vag79.mongodb.net/${process.env.DB_name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const allProduct = client.db("emajohn").collection("products");
  const orderedProduct = client.db("emajohn").collection("orders");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    //   console.log(product);
    allProduct.insertOne(product).then((result) => {
      res.send(result.insertedId);
    });
  });
  app.get("/", (req, res) => {
    res.send("hello db is working");
  });

  app.get("/products", (req, res) => {
    allProduct
      .find({})
      .limit(10)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.get("/product/:key", (req, res) => {
    allProduct.find({ key: req.params.key }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/productsByKeys", (req, res) => {
    const productsKeys = req.body;
    allProduct
      .find({ key: { $in: productsKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    orderedProduct.insertOne(order).then((result) => {
      res.send(result.insertedId > 0);
    });
  });
});

app.listen(process.env.PORT || port);
