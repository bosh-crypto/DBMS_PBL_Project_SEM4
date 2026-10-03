export default function StatCards({ summary }) {
  const total = type => Math.round(summary.byType.find(t => t.type === type)?.total || 0);
  const items = [
    ['Total Meters', summary.totalMeters], ['Active Meters', summary.activeMeters],
    ['Readings Logged', summary.totalReadings], ['Electricity (kWh)', total('electricity')],
    ['Water (L)', total('water')], ['Gas (m³)', total('gas')],
  ];
  return <div className="stats">{items.map(([l, v]) => (
    <div className="card stat" key={l}><span className="muted">{l}</span><b>{v.toLocaleString()}</b></div>
  ))}</div>;
}
