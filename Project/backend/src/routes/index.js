// ROUTES: URL -> controller mapping. Everything except login needs a valid JWT.
const router = require('express').Router();
const auth = require('../middleware/auth');
const A = require('../controllers/authController');
const M = require('../controllers/meterController');
const R = require('../controllers/readingController');
const S = require('../controllers/analyticsController');

const wrap = fn => (req, res, next) => fn(req, res).catch(next); // async error helper

router.post('/auth/login', wrap(A.login));

router.get('/meters', auth, wrap(M.list));
router.post('/meters', auth, wrap(M.create));
router.put('/meters/:id', auth, wrap(M.update));
router.delete('/meters/:id', auth, wrap(M.remove));

router.get('/readings', auth, wrap(R.list));
router.post('/readings', auth, wrap(R.create));
router.put('/readings/:id', auth, wrap(R.update));
router.delete('/readings/:id', auth, wrap(R.remove));

router.get('/analytics/summary', auth, wrap(S.summary));
router.get('/analytics/trend', auth, wrap(S.trend));
router.get('/analytics/monitor', auth, wrap(S.monitor));

router.use((err, req, res, next) => res.status(500).json({ message: err.message }));
module.exports = router;
