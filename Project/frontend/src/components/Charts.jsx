// Chart.js charts: line (daily trend per utility) + doughnut (share by utility)
import { Chart, registerables } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
Chart.register(...registerables);

const COLORS = { electricity: '#f5a524', water: '#3b82f6', gas: '#ef4444' };

export default function Charts({ trend, summary }) {
  const days = [...new Set(trend.map(r => r.readingDate))];
  const datasets = Object.keys(COLORS).map(type => ({
    label: type, borderColor: COLORS[type], backgroundColor: COLORS[type], tension: 0.3,
    data: days.map(d => trend.find(r => r.readingDate === d && r.type === type)?.total || 0),
    yAxisID: type === 'water' ? 'y1' : 'y',   // water uses its own axis (much larger numbers)
  }));
  return (
    <div className="charts">
      <div className="card"><h3>Daily Consumption (30 days)</h3>
        <Line data={{ labels: days, datasets }} options={{ scales: { y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />
      </div>
      <div className="card"><h3>Consumption Share</h3>
        <Doughnut data={{
          labels: summary.byType.map(t => t.type),
          datasets: [{ data: summary.byType.map(t => t.total), backgroundColor: summary.byType.map(t => COLORS[t.type]) }],
        }} />
      </div>
    </div>
  );
}
