// One reusable page for Electricity / Gas / Water. The "type" prop decides which data it shows.
import { useState } from 'react';
import MeterManager from '../components/MeterManager';
import ReadingManager from '../components/ReadingManager';
import Monitoring from '../components/Monitoring';

export const INFO = {
  electricity: { title: '⚡ Electricity', unit: 'kWh', color: '#f5a524' },
  gas: { title: '🔥 Gas', unit: 'm³', color: '#ef4444' },
  water: { title: '💧 Water', unit: 'L', color: '#3b82f6' },
};

export default function UtilityPage({ type }) {
  const [tab, setTab] = useState('monitoring');
  const tabs = [['monitoring', 'Monitoring'], ['meters', 'Meters'], ['readings', 'Readings']];
  return (<>
    <h2>{INFO[type].title}</h2>
    <div className="tabs">{tabs.map(([k, l]) => (
      <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
    ))}</div>
    {tab === 'monitoring' && <Monitoring type={type} />}
    {tab === 'meters' && <MeterManager type={type} />}
    {tab === 'readings' && <ReadingManager type={type} />}
  </>);
}
