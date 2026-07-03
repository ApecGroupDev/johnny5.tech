"use client";

import { useState } from "react";
import { Container } from "@/app/components/ui/container";
import { ArrowLeft, Shield, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard({ initialUsers, currentUser }: any) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u: any) => u.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert("An error occurred");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers([data, ...users]);
        setForm({ name: "", email: "", password: "", role: "user" });
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative pb-24">
      <Container>
        <div className="pt-10 pb-6">
          <Link
            href="/"
            className="link-underline font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Portal
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
                <span>System</span>
                <span className="text-subtle">·</span>
                <span>Restricted</span>
              </div>
              <h1 className="mt-2 flex items-center gap-3 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                <Shield className="h-8 w-8 text-emerald-500" />
                Admin Dashboard
              </h1>
              <p className="mt-3 text-muted md:text-lg">
                Manage portal access and user identities.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* User List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              Jedi Archives ({users.length})
            </h2>
            <div className="rounded-xl border border-blue-400/40 bg-slate-50/95 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.2)] overflow-hidden">
              <div className="divide-y divide-slate-200">
                {users.map((user: any) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 hover:bg-blue-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 tracking-tight">{user.name || "Unnamed"}</span>
                        {user.role === "admin" && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/10">Jedi Master</span>
                        )}
                        {user.id === currentUser?.id && (
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 ring-1 ring-inset ring-slate-400/20">You</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 font-mono mt-0.5">{user.email}</div>
                    </div>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Add User Form */}
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] mb-4">
              Imperial Recruitment
            </h2>
            <form onSubmit={handleCreate} className="rounded-xl border border-red-500/40 bg-slate-50/95 backdrop-blur-xl p-5 shadow-[0_0_20px_rgba(239,68,68,0.2)] space-y-4">
              {error && (
                <div className="rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700 border border-red-200">
                  {error}
                </div>
              )}
              
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5">Designation (Name)</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-inner outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  placeholder="CT-7567 (Rex)"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5">Comlink (Email)</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-inner outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  placeholder="clone@empire.gov"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5">Clearance Code (Password)</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-inner outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5">Rank (Role)</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all appearance-none"
                >
                  <option value="user">Trooper (User)</option>
                  <option value="admin">Sith Lord (Admin)</option>
                </select>
              </div>

              <button
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" />
                {loading ? "Deploying..." : "Deploy Trooper"}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
