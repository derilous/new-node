const mongoose = require('mongoose');
const Store = mongoose.model('Store');

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
  //   fire a connection to MongoDB to take
  store.save();
  req.flash(
    'success',
    `Successfully created ${store.name}. Care to leave a review?`
  );
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // query the database for list of all stores here
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores: stores });
};
