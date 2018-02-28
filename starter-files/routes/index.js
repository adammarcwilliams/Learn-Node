const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

// Show stores
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// Add new store
router.get('/add', storeController.addStore);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore));

// Edit existing store
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post(`/add/:id`,
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore));

// Tags page
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

// User Management
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister);

module.exports = router;
