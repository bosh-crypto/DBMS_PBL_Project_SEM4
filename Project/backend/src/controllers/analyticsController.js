const { fn, col, literal } = require('sequelize');
const { Meter, Reading } = require('../models');

// KPI cards + consumption per utility type (Dashboard)
exports.summary = async (req, res) => {
  const totalMeters = await Meter.count();
  const activeMeters = await Meter.count({ where: { status: 'active' } });
  const totalReadings = await Reading.count();
  const byType = await Reading.findAll({
    attributes: [[col('Meter.type'), 'type'], [fn('SUM', col('consumption')), 'total']],
    include: [{ model: Meter, attributes: [] }], group: ['Meter.type'], raw: true,
  });
  res.json({ totalMeters, activeMeters, totalReadings, byType });
};

// Daily consumption, last 30 days. Optional ?type=water
exports.trend = async (req, res) => {
  const inc = { model: Meter, attributes: [] };
  if (req.query.type) inc.where = { type: req.query.type };
  res.json(await Reading.findAll({
    attributes: ['readingDate', [col('Meter.type'), 'type'], [fn('SUM', col('consumption')), 'total']],
    include: [inc], where: literal('readingDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)'),
    group: ['readingDate', 'Meter.type'], order: [['readingDate', 'ASC']], raw: true,
  }));
};

// MONITORING: per-meter health for one utility type
// Status rules: no readings -> No data | last reading > 7 days old -> Overdue
//               last consumption > 1.5 x 30-day average -> High usage | else Normal
exports.monitor = async (req, res) => {
  const meters = await Meter.findAll({ where: { type: req.query.type }, include: Reading });
  const now = Date.now();
  res.json(meters.map(m => {
    const rs = [...m.Readings].sort((a, b) => (a.readingDate < b.readingDate ? 1 : -1)); // newest first
    const last = rs[0];
    const recent = rs.filter(r => now - new Date(r.readingDate) < 30 * 864e5 && r.consumption > 0);
    const avg = recent.length ? recent.reduce((s, r) => s + r.consumption, 0) / recent.length : 0;
    let status = 'Normal';
    if (!last) status = 'No data';
    else if (now - new Date(last.readingDate) > 7 * 864e5) status = 'Overdue';
    else if (avg && last.consumption > avg * 1.5) status = 'High usage';
    return {
      id: m.id, meterNumber: m.meterNumber, customerName: m.customerName, location: m.location,
      meterStatus: m.status, lastDate: last?.readingDate || null, lastValue: last?.value ?? null,
      lastConsumption: last?.consumption ?? null, avgConsumption: Math.round(avg * 10) / 10, status,
    };
  }));
};
