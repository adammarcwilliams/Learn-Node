const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter (req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: `That file type isn't allowed!` }, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index', { title: 'Food food food' });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  console.log(req.file);
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  console.log('req.body.photo is: ', req.body.photo);

  const photo = await jimp.read(req.file.buffer);
  console.log('The photo back from jimp.read is: ', photo);
  await photo.resize(800, jimp.AUTO);
  console.log('The jimp photo again after resize: ', photo);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({slug: req.params.slug});
  if (!store) {
    return next();
  }
  res.render('store', { title: store.name, store });
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({_id: req.params.id});
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // set the location data to be a point
  req.body.location.type = 'Point';
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store ⮕</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};
