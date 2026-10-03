// CRUD for meters: Add (POST), Update (PUT), Delete (DELETE)
import { useEffect, useState } from 'react';
import api from '../api';

const empty = { meterNumber: '', customerName: '', location: '', status: 'active' };

export default function MeterManager({ type }) {
  const [meters, setMeters] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/meters', { params: { type } }).then(r => setMeters(r.data));
  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/meters/${editId}`, form);
      else await api.post('/meters', { ...form, type });
      setForm(empty); setEditId(null); load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save'); }
  };
  const edit = m => { setEditId(m.id); setForm({ meterNumber: m.meterNumber, customerName: m.customerName, location: m.location, status: m.status }); };
  const del = async m => { if (confirm(`Delete meter ${m.meterNumber} and all its readings?`)) { await api.delete(`/meters/${m.id}`); load(); } };
  const set = k => e => setForm({ ...form, [k]: e.target.value });

  return (<>
    <form className="card row-form" onSubmit={save}>
      <b>{editId ? 'Update meter' : 'Add meter'}</b>
      <input required placeholder="Meter no." value={form.meterNumber} onChange={set('meterNumber')} />
      <input placeholder="Customer" value={form.customerName} onChange={set('customerName')} />
      <input placeholder="Location" value={form.location} onChange={set('location')} />
      <select value={form.status} onChange={set('status')}><option>active</option><option>inactive</option></select>
      <button>{editId ? 'Update' : 'Add'}</button>
      {editId && <button type="button" className="ghost" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      {error && <span className="error">{error}</span>}
    </form>
    <div className="card"><table>
      <thead><tr><th>Meter</th><th>Customer</th><th>Location</th><th>Status</th><th></th></tr></thead>
      <tbody>{meters.map(m => (
        <tr key={m.id}><td>{m.meterNumber}</td><td>{m.customerName}</td><td>{m.location}</td><td>{m.status}</td>
          <td className="actions"><button onClick={() => edit(m)}>Edit</button><button className="danger" onClick={() => del(m)}>Delete</button></td></tr>
      ))}</tbody>
    </table>{!meters.length && <p className="muted">No meters yet.</p>}</div>
  </>);
}
