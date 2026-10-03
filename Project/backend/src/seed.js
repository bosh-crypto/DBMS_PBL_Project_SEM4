// Run once: npm run seed  -> creates admin user + demo meters + 30 days of readings
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Meter, Reading } = require('./models');

(async () => {
  await sequelize.sync({ force: true });
  await User.create({ name: 'Admin', email: 'admin@utility.com', role: 'admin', password: await bcrypt.hash('admin123', 10) });
  const defs = [
    ['E-1001', 'electricity', 'Ravi Kumar', 'Kukatpally'], ['E-1002', 'electricity', 'Anita Rao', 'Miyapur'],
    ['W-2001', 'water', 'Suresh Reddy', 'Quthbullapur'], ['W-2002', 'water', 'Meena Iyer', 'Jeedimetla'],
    ['G-3001', 'gas', 'Farhan Ali', 'Kompally'], ['G-3002', 'gas', 'Priya Nair', 'Bachupally'],
  ];
  const base = { electricity: [12, 8], water: [400, 150], gas: [3, 2] }; // [avg, variation] per day
  for (const [meterNumber, type, customerName, location] of defs) {
    const m = await Meter.create({ meterNumber, type, customerName, location });
    let value = 1000;
    for (let d = 30; d >= 0; d--) {
      const c = Math.round((base[type][0] + Math.random() * base[type][1]) * 10) / 10;
      value += c;
      const date = new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);
      await Reading.create({ meterId: m.id, value, consumption: d === 30 ? 0 : c, readingDate: date });
    }
  }
  console.log('Seeded! Login: admin@utility.com / admin123');
  process.exit();
})();
