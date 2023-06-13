const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const jimp = require('jimp');
const uuid = require('uuid');

// lib to enable image uploading
const multer = require('multer');
// verify file type of uploading file to be an image file
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next(
        {
          message: 'This file type is not allowed',
        },
        false
      );
    }
  },
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store',
  });
};

exports.createStore = async (req, res) => {
  // taking store details from the input fields, and passing it here into store variable as
  // JSON using req.body. .body will automatically parse the data appropriately.
  const store = await new Store(req.body).save();
  //   fire a connection to MongoDB to take details and save
  req.flash(
    'success',
    `Successfully created ${store.name}. Care to leave a review?`
  );
  res.redirect(`/store/${store.slug}`);
};

exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
  // check if there's no new file to resize
  if (!req.file) {
    next();
    return;
  } else {
    const extension = req.file.mimetype.split('/')[1];
    // replaces photo name with random unique name / ID
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // console.log(req.file);
    // once we have written photo to file:
    next();
  }
};

exports.getStores = async (req, res) => {
  // query the database for list of all stores here
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores: stores });
};

exports.editStore = async (req, res) => {
  // Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id });
  // Confirm they are the owner of the store
  //  Render out the edit form so the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // Set edited location data to be a point
  // req.body.location.type = 'Point';
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  }).exec();
  req.flash(
    'success',
    `Successfully updated ${store.name}. <a href="/store/${store.slug}>View Store</a>`
  );
  // redirect to store and tell user it worked
  res.redirect(`/stores/${store._id}/edit`);
};
