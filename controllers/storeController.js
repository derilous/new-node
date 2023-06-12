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

exports.editStore = async (req, res) => {
  // Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id });
  // Confirm they are the owner of the store
  //  Render out the edit form so the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  }).exec();
  req.flash(
    'success',
    `Successfully updated ${store.name}. <a href="/store/${store.slug}>View Store</a>`
  );
  res.redirect(`/stores/${store._id}/edit`);
  // redirect to store and tell them it worked
};
