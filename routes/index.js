const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
// grabbing the error handler code block so if anything goes wrong on any route, errorHandler
// kicks in and passes it onto a bunch of middleware to figure out what kind of error you want
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
//create store form hadler
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post(
  '/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

module.exports = router;
