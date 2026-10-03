// MONITORING tab: live health of every meter + 30-day trend. Auto-refreshes every 30s.
import { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../api';
import { INFO } from '../pages/UtilityPage';
Chart.register(...registerables);

export default function Monitoring({ type }) {
  const [rows, setRows] = useState([]);
  const [trend, setTrend] = useState([]);
  const [updated, setUpdated] = useState(null);
  const { unit, color } = INFO[type];

  const load = () => Promise.all([api.get('/analytics/monitor', { params: { type } }), api.get('/analytics/trend', { params: { type } })])
    .then(([m, t]) => { setRows(m.data); setTrend(t.data); setUpdated(new Date().toLocaleTimeString()); });
  useEffect(() => { load(); const id = setInterval(load, 30000); return () => clearInterval(id); }, []);

  const count = s => rows.filter(r => r.status === s).length;
  const cards = [['Meters', rows.length], ['Normal', count('Normal')], ['High usage', count('High usage')], ['Overdue / No data', count('Overdue') + count('No data')]];

  return (<>
    <div className="stats">{cards.map(([l, v]) => <div className="card stat" key={l}><span className="muted">{l}</span><b>{v}</b></div>)}</div>
    <div className="card">
      <h3>Daily consumption – last 30 days ({unit})</h3>
      <Line data={{ labels: trend.map(r => r.readingDate), datasets: [{ label: type, data: trend.map(r => r.total), borderColor: color, backgroundColor: color + '33', fill: true, tension: 0.3 }] }} />
    </div>
    <div className="card">
      <div className="between"><h3>Meter status</h3><span className="muted">Updated {updated} · <a href="#" onClick={e => { e.preventDefault(); load(); }}>Refresh</a></span></div>
      <table>
        <thead><tr><th>Meter</th><th>Customer</th><th>Last reading</th><th>Last used ({unit})</th><th>30-day avg</th><th>Status</th></tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.id}><td>{r.meterNumber}</td><td>{r.customerName}</td><td>{r.lastDate || '—'}</td>
            <td>{r.lastConsumption != null ? Math.round(r.lastConsumption * 10) / 10 : '—'}</td><td>{r.avgConsumption}</td>
            <td><span className={`badge ${r.status.replace(' ', '')}`}>{r.status}</span></td></tr>
        ))}</tbody>
      </table>
      <p className="muted">High usage = last use is above 1.5× the 30-day average. Overdue = no reading for 7+ days.</p>
    </div>
  </>);
}
