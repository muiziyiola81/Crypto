import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../hooks/useAdmin';
import { Users, Search, Database, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const { navigateTo, setAdminSelectedUserId } = useAuth();
  const { users, loading, refreshAdminData } = useAdmin();
  const [search, setSearch] = useState('');

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
  });

  const handleSelectUser = (userId: string) => {
    setAdminSelectedUserId(userId);
    navigateTo('admin_records', null, userId);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3">
        <button
          onClick={() => navigateTo('admin_dashboard')}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Admin Console</span>
        </button>

        <h1 className="text-sm font-semibold tracking-tight text-white">
          Registered Users Management
        </h1>

        <button
          onClick={() => navigateTo('admin_records')}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
        >
          <span>All Records</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Filter users by email or UUID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="vault-input w-full pl-10 pr-4 py-3 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5 pointer-events-none" />
      </div>

      {/* Users Table / Card List */}
      <div className="vault-panel rounded-3xl overflow-hidden divide-y divide-zinc-800/80">
        <div className="p-4 bg-zinc-950/60 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>User Accounts ({filteredUsers.length})</span>
          </div>
          <span>Stored Records</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500 animate-pulse">
            Loading user records...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            No registered users found matching &quot;{search}&quot;.
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/50 transition"
            >
              <div className="space-y-1 truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white truncate">{u.email}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </div>
                <div className="text-[11px] font-mono text-zinc-500 truncate">
                  UUID: {u.id}
                </div>
                <div className="text-[10px] text-zinc-600">
                  Registered: {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-white block tabular-nums">
                    {u.record_count}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">records</span>
                </div>

                <button
                  onClick={() => handleSelectUser(u.id)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>View Records</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
