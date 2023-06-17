const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply coordinates!',
      },
    ],
    address: {
      type: String,
      required: 'You must supply an address!',
    },
  },
  photo: String,
});

storeSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  // Check if other stores would share the same slug using regex
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    // $unwind is a mongo DB operator that will, in this instance, go ahead and create a duplicate entry on the
    // frontend for every store that uses a tag if it has more than one tag.
    { $unwind: '$tags' },
    // group is taking the tags by the unwind and adding a count for every listing generated.
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 },
      },
    },
    // basically sorting the grouped stuff from highest count to lowest
    {
      $sort: { count: -1 },
    },
  ]);
};

module.exports = mongoose.model('Store', storeSchema);
