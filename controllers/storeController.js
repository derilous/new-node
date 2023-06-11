const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  //   console.log(req.name);
  req.flash('error', 'Oops! Something went wrong!');
  req.flash('success', 'Success');
  req.flash('warning', 'Ay ay ay, careful!');
  req.flash('info', `Better know what you're doing dumbass`);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store',
  });
};

exports.createStore = (req, res) => {
  // taking store details from the input fields, and passing it here into store variable as
  // JSON using req.body. .body will automatically parse the data appropriately.
  const store = new Store(req.body);
  //   fire a connection to MongoDB to take
  store.save();
  req.flash(
    'success',
    `Successfully created ${store.name}. Care to leave a review?`
  );
  res.redirect('/');
};
