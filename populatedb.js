#! /usr/bin/env node

// console.log(
//   "This script populates some test products, brands, and categories to your database. Specified database as argument - e.g.: populatedb "mongodb+srv://inventory-app-admin:super-user@cluster0.dg6jj.mongodb.net/inventory-app?retryWrites=true&w=majority"
// );

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require("async");
var Brand = require("./models/brand");
var Category = require("./models/category");
var Product = require("./models/product");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(mongoDB);
// mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const brands = [];
const categories = [];
const products = [];

function brandCreate(title, description, cb) {
  const brandDetail = {
    title,
    description,
  };

  const brand = new Brand(brandDetail);

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function categoryCreate(title, description, cb) {
  const categoryDetail = {
    title,
    description,
  };
  const category = new Category(categoryDetail);

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("new category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function productCreate(title, price, rating, brand, category, quantity, cb) {
  const productDetail = {
    title,
    price,
    rating,
    brand,
    category,
    quantity,
  };

  const product = new Product(productDetail);
  product.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New product: " + product);
    products.push(product);
    cb(null, product);
  });
}

function createBrands(cb) {
  async.series(
    [
      function (callback) {
        brandCreate(
          "Ryobi",
          "Ryobi is one of the world’s largest and most innovative power tool companies. We create affordable tools with ‘pro features’ for the home handyperson, gardener, camper and craft enthusiast.",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Gorilla Ladders",
          "As one of Australian's largest and most innovative ladder manufacturers, Gorilla Ladders offers a wide range of safe working at heights solutions for domestic through to heavy industrial users.",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Mondella",
          "Mondella takes the hard work out of choosing your bathroom ware. From contemporary to classic, our collections offer a wide range of affordable styles that are on-trend and easy to install. Best of all, products in each collection coordinate with one another, making it easy to transform your bathroom into a stylish sanctuary.",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Flexispray",
          "Simplicity, value and modern design are the hallmarks of the Flexispray range of showers, tapware and accessories. \n Across the range we blend contemporary design with quality engineering and the latest technology.",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Energizer",
          "Energizer, the makers of the World’s longest lasting AA & AAA Battery in High-Tech Devices, continue to give consumers the benefit of greater power to do, enjoy and accomplish more of the world.",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Victa",
          "Victa is an iconic Australian brand with a history spanning 60 years. Victa offers a diverse range of products that includes Lawn Mowers, Trimmers, Chainsaws, Hedgers, Edgers and Blowers designed and tested for New Zealand and Australian conditions.",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "Tools",
          "We’ve got the right tools for the job. Find the tools you need to get your next D.I.Y. project done.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Garden",
          "Make your garden grow. Bring your garden to life with our wide range of gardening supplies.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Building & Hardware",
          "Let's make it happen. If you can dream it, we've got what you need to build it.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Bathroom & Plumbing",
          "Let's get started on your bathroom. We've got the products and the inspiration to create your dream bathroom.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Lighting & Electrical",
          "Brighten your world. Light up your home with our stylish range of lights for indoors and out.",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createProducts(cb) {
  async.parallel(
    [
      function (callback) {
        productCreate(
          "Ryobi 18V ONE+ 2.0Ah Drill Driver Kit",
          99,
          4,
          brands[0],
          categories[0],
          14,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Ryobi 18V ONE+ 4.0Ah 33cm Lawn Mower Kit",
          329,
          3,
          brands[0],
          categories[1],
          6,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Gorilla 0.9m 150kg Aluminium Platform Ladder",
          269,
          5,
          brands[1],
          categories[2],
          5,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Mondella Rococo Rimless Back To Wall Toilet Suite",
          229,
          2,
          brands[2],
          categories[3],
          18,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Flexispray WELS 3 Star, 9L/Min Pulsar 5 Function Rail Shower",
          66,
          4,
          brands[3],
          categories[3],
          2,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Energizer 1000 Lumen Tactical Light Torch",
          99,
          3,
          brands[4],
          categories[4],
          8,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Energizer Max AA Alkaline Batteries - 12 Pack",
          9.94,
          2,
          brands[4],
          categories[4],
          7,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Ryobi 1800W 2000PSI Pressure Washer",
          99,
          4,
          brands[0],
          categories[0],
          7,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Ryobi One+ 18V 165mm Circular Saw - Skin Only",
          149,
          5,
          brands[0],
          categories[0],
          3,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Gorilla 2.4 - 3.9m 100kg Domestic Aluminium Extension Ladder",
          139,
          4,
          brands[1],
          categories[3],
          3,
          callback
        );
      },
      function (callback) {
        productCreate(
          'Victa 18" Classic Cut Mulch Or Catch Petrol Lawn Mower',
          399,
          5,
          brands[5],
          categories[1],
          3,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createBrands, createCategories, createProducts],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Products: " + products);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
