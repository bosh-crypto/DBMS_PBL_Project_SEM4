const { Meter } = require('../models');

exports.list = async (req, res) => {
  const where = req.query.type ? { type: req.query.type } : {};
  res.json(await Meter.findAll({ where, order: [['id', 'DESC']] }));
};
exports.create = async (req, res) => {
  try { res.status(201).json(await Meter.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
};
exports.update = async (req, res) => {
  const m = await Meter.findByPk(req.params.id);
  if (!m) return res.status(404).json({ message: 'Meter not found' });
  try { res.json(await m.update(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
};
exports.remove = async (req, res) => {
  await Meter.destroy({ where: { id: req.params.id } }); // readings are deleted too (CASCADE)
  res.json({ message: 'Deleted' });
};
