// Overview of all utilities
import { useEffect, useState } from 'react';
import api from '../api';
import StatCards from '../components/StatCards';
import Charts from '../components/Charts';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  useEffect(() => {
    Promise.all([api.get('/analytics/summary'), api.get('/analytics/trend')])
      .then(([s, t]) => { setSummary(s.data); setTrend(t.data); });
  }, []);
  return (<>
    <h2>Dashboard</h2>
    {!summary ? <p>Loading…</p> : <><StatCards summary={summary} /><Charts trend={trend} summary={summary} /></>}
  </>);
}
