// CRUD for readings of this utility type
import { useEffect, useState } from 'react';
import api from '../api';
import { INFO } from '../pages/UtilityPage';

const today = () => new Date().toISOString().slice(0, 10);

export default function ReadingManager({ type }) {
  const [meters, setMeters] = useState([]);
  const [readings, setReadings] = useState([]);
  const [form, setForm] = useState({ meterId: '', value: '', readingDate: today() });
  const [editId, setEditId] = useState(null);

  const load = () => Promise.all([api.get('/meters', { params: { type } }), api.get('/readings', { params: { type } })])
    .then(([m, r]) => { setMeters(m.data); setReadings(r.data); });
  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault();
    if (editId) await api.put(`/readings/${editId}`, form);
    else await api.post('/readings', form);
    setEditId(null); setForm({ ...form, value: '' }); load();
  };
  const edit = r => { setEditId(r.id); setForm({ meterId: r.meterId, value: r.value, readingDate: r.readingDate }); };
  const del = async r => { if (confirm('Delete this reading?')) { await api.delete(`/readings/${r.id}`); load(); } };

  return (<>
    <form className="card row-form" onSubmit={save}>
      <b>{editId ? 'Update reading' : 'Add reading'}</b>
      <select required disabled={!!editId} value={form.meterId} onChange={e => setForm({ ...form, meterId: e.target.value })}>
        <option value="">Select meter</option>
        {meters.map(m => <option key={m.id} value={m.id}>{m.meterNumber} – {m.customerName}</option>)}
      </select>
      <input required type="number" step="any" placeholder="Meter value" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
      <input type="date" value={form.readingDate} onChange={e => setForm({ ...form, readingDate: e.target.value })} />
      <button>{editId ? 'Update' : 'Add'}</button>
      {editId && <button type="button" className="ghost" onClick={() => { setEditId(null); setForm({ ...form, value: '' }); }}>Cancel</button>}
    </form>
    <div className="card"><table>
      <thead><tr><th>Date</th><th>Meter</th><th>Value</th><th>Used ({INFO[type].unit})</th><th></th></tr></thead>
      <tbody>{readings.map(r => (
        <tr key={r.id}><td>{r.readingDate}</td><td>{r.Meter?.meterNumber}</td><td>{r.value}</td><td>{Math.round(r.consumption * 10) / 10}</td>
          <td className="actions"><button onClick={() => edit(r)}>Edit</button><button className="danger" onClick={() => del(r)}>Delete</button></td></tr>
      ))}</tbody>
    </table>{!readings.length && <p className="muted">No readings yet.</p>}</div>
  </>);
}
