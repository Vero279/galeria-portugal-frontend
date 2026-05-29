import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role?: { name: string };
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sendingReset, setSendingReset] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_STRAPI_URL}/api/users?populate=role`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('strapi_jwt')}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleResetPassword = async (userId: number, email: string) => {
    if (!confirm(`Enviar link de reset para ${email}?`)) return;
    setSendingReset(userId);
    try {
      const res = await fetch(`${import.meta.env.VITE_STRAPI_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) alert('Email enviado!');
      else alert('Erro ao enviar email');
    } catch (err) {
      alert('Erro na requisição');
    } finally {
      setSendingReset(null);
    }
  };

  const filteredUsers = users.filter(u => filter === 'all' || u.role?.name?.toLowerCase() === filter);

  if (loading) return <div className="text-center py-8">A carregar utilizadores...</div>;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {['all', 'admin', 'artist', 'customer'].map(role => (
          <button key={role} onClick={() => setFilter(role)} className={`px-3 py-1 text-xs rounded ${filter === role ? 'bg-amber-500 text-black' : 'bg-white/10'}`}>
            {role === 'all' ? 'Todos' : role}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10"><tr><th>ID</th><th>Nome</th><th>Email</th><th>Role</th><th>Ações</th></tr></thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3">{u.username}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role?.name || 'N/A'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleResetPassword(u.id, u.email)} disabled={sendingReset === u.id} className="p-1 hover:bg-white/10 rounded" title="Reset password">
                    <Mail size={16} className="text-blue-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}