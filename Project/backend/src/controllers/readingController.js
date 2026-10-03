const { Reading, Meter } = require('../models');

// Recalculate consumption for a meter (value - previous value) after any add/edit/delete
const recalc = async meterId => {
  const rows = await Reading.findAll({ where: { meterId }, order: [['readingDate', 'ASC'], ['id', 'ASC']] });
  let prev = null;
  for (const r of rows) {
    const c = prev === null ? 0 : Math.max(0, r.value - prev);
    if (r.consumption !== c) await r.update({ consumption: c });
    prev = r.value;
  }
};

exports.list = async (req, res) => {
  const include = { model: Meter };
  if (req.query.type) include.where = { type: req.query.type };
  const where = req.query.meterId ? { meterId: req.query.meterId } : {};
  res.json(await Reading.findAll({ where, include, order: [['readingDate', 'DESC'], ['id', 'DESC']], limit: 200 }));
};
exports.create = async (req, res) => {
  const { meterId, value, readingDate } = req.body;
  const r = await Reading.create({ meterId, value, readingDate });
  await recalc(meterId);
  res.status(201).json(r);
};
exports.update = async (req, res) => {
  const r = await Reading.findByPk(req.params.id);
  if (!r) return res.status(404).json({ message: 'Reading not found' });
  await r.update({ value: req.body.value, readingDate: req.body.readingDate });
  await recalc(r.meterId);
  res.json(r);
};
exports.remove = async (req, res) => {
  const r = await Reading.findByPk(req.params.id);
  if (r) { const id = r.meterId; await r.destroy(); await recalc(id); }
  res.json({ message: 'Deleted' });
};
