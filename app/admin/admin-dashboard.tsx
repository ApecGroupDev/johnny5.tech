"use client";

import { useState } from "react";
import { Container } from "@/app/components/ui/container";
import {
  ArrowLeft,
  Shield,
  Trash2,
  UserPlus,
  Pencil,
  Save,
  X,
  Users,
  Activity,
  UserCheck,
  AppWindow
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StarsBackground } from "@/app/components/stars-background";
import { APPS } from "@/app/apps/_components/app-data";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  active: boolean | null;
  allowedApps: string | null;
  createdAt: string | Date;
}

interface AdminDashboardProps {
  initialUsers: User[];
  currentUser: User;
}

export default function AdminDashboard({ initialUsers, currentUser }: AdminDashboardProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    active: true,
    allowedApps: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const activeUsers = users.filter((u: User) => u.active !== false).length;
  const adminUsers = users.filter((u: User) => u.role === "admin").length;

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((u: User) => u.id !== id));
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
        closeForm();
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: Partial<User> & { password?: string } = {
        id: editingUser!.id,
        name: form.name,
        email: form.email,
        role: form.role,
        active: form.active,
        allowedApps: form.allowedApps,
      };
      if (form.password) payload.password = form.password; // only send if changing

      const res = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((u: User) => (u.id === editingUser!.id ? data : u)));
        closeForm();
      } else {
        setError(data.error || "Failed to update user");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(user: User) {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role,
      active: user.active !== false,
      allowedApps: user.allowedApps || "",
    });
    setError("");
    setIsFormOpen(true);
  }

  function startCreating() {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", role: "user", active: true, allowedApps: "" });
    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingUser(null);
      setForm({ name: "", email: "", password: "", role: "user", active: true, allowedApps: "" });
      setError("");
    }, 300); // wait for animation
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg pb-24 font-sans text-slate-100">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <StarsBackground />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-900/40 px-8 backdrop-blur-md">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Portal
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-200">{currentUser?.name}</div>
              <div className="text-xs text-slate-500 font-mono">{currentUser?.email}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <Container>
          <div className="py-12 space-y-8">
            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-blue-400 mb-2">
                  <span>System</span>
                  <span className="text-slate-600">/</span>
                  <span>Restricted</span>
                </div>
                <h1 className="flex items-center gap-3 font-display text-4xl tracking-tight text-white md:text-5xl">
                  <Shield className="h-8 w-8 text-emerald-500 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                  Jedi Archives
                </h1>
                <p className="mt-3 text-slate-400 md:text-lg">
                  Command center for deployment access and clearance codes.
                </p>
              </div>
              <button
                onClick={startCreating}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <UserPlus className="h-4 w-4" />
                Deploy Trooper
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-blue-500/20 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-blue-400/80">Total Personnel</div>
                    <div className="text-3xl font-display font-bold text-white">{users.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-emerald-400/80">Active Deployments</div>
                    <div className="text-3xl font-display font-bold text-white">{activeUsers}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-purple-400/80">Jedi Council</div>
                    <div className="text-3xl font-display font-bold text-white">{adminUsers}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AppWindow className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-amber-400/80">Active Systems</div>
                    <div className="text-3xl font-display font-bold text-white">{APPS.length}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-blue-400/40 bg-slate-50/95 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-blue-100/50 text-[10px] uppercase tracking-widest text-blue-900/70 border-b border-blue-200/50">
                    <tr>
                      <th className="px-6 py-4 font-bold">Designation</th>
                      <th className="px-6 py-4 font-bold">Comlink</th>
                      <th className="px-6 py-4 font-bold">Rank</th>
                      <th className="px-6 py-4 font-bold">Access</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {users.map((user: User) => (
                      <tr key={user.id} className="transition-colors hover:bg-blue-50/60">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="font-bold text-slate-900 tracking-tight text-base">
                              {user.name || "Unnamed"}
                            </div>
                            {user.id === currentUser?.id && (
                              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 ring-1 ring-inset ring-slate-400/20">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          {user.role === "admin" ? (
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              Jedi Master
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 ring-1 ring-inset ring-slate-500/10">
                              Trooper
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.role === 'admin' ? (
                            <span className="text-xs font-mono text-slate-500">All Systems (Admin)</span>
                          ) : user.allowedApps ? (
                            <div className="flex flex-wrap gap-1">
                              {user.allowedApps.split(',').filter(Boolean).map((slug: string) => {
                                const app = APPS.find(a => a.slug === slug);
                                if (!app) return null;
                                return <span key={slug} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] border border-amber-200 uppercase tracking-widest font-bold">{app.title}</span>
                              })}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.active !== false ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.8)]"></span>
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"></span>
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEditing(user)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                              title="Modify Protocol"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            {user.id !== currentUser?.id && (
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                title="Terminate Code"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Centered Modal for Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-lg rounded-2xl border bg-slate-50/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden ${
                editingUser ? "border-amber-500/40 shadow-[0_10px_40px_rgba(245,158,11,0.2)]" : "border-red-500/40 shadow-[0_10px_40px_rgba(239,68,68,0.2)]"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <h2
                  className={`font-mono text-sm uppercase tracking-[0.18em] font-bold ${
                    editingUser ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  }`}
                >
                  {editingUser ? "Modify Protocol" : "Imperial Recruitment"}
                </h2>
                <button
                  onClick={closeForm}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={editingUser ? handleUpdate : handleCreate}
                className="space-y-5"
              >
                {error && (
                  <div
                    className={`rounded-lg p-3 text-sm font-medium border ${
                      editingUser ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5">
                    Designation (Name)
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-inner outline-none transition-all ${
                      editingUser ? "focus:border-amber-500 focus:ring-1 focus:ring-amber-500" : "focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    }`}
                    placeholder="CT-7567 (Rex)"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5">
                    Comlink (Email)
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-inner outline-none transition-all ${
                      editingUser ? "focus:border-amber-500 focus:ring-1 focus:ring-amber-500" : "focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    }`}
                    placeholder="clone@empire.gov"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5 flex items-baseline justify-between">
                    <span>Clearance Code</span>
                    {editingUser && (
                      <span className="text-[10px] text-slate-400 font-normal normal-case tracking-normal">
                        (Leave blank to keep)
                      </span>
                    )}
                  </label>
                  <input
                    required={!editingUser}
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-inner outline-none transition-all ${
                      editingUser ? "focus:border-amber-500 focus:ring-1 focus:ring-amber-500" : "focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    }`}
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5">
                      Rank (Role)
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner outline-none transition-all appearance-none ${
                        editingUser ? "focus:border-amber-500 focus:ring-1 focus:ring-amber-500" : "focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      }`}
                    >
                      <option value="user">Trooper (User)</option>
                      <option value="admin">Sith Lord (Admin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-1.5">
                      Status
                    </label>
                    <select
                      value={form.active ? "true" : "false"}
                      onChange={(e) =>
                        setForm({ ...form, active: e.target.value === "true" })
                      }
                      className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner outline-none transition-all appearance-none ${
                        editingUser ? "focus:border-amber-500 focus:ring-1 focus:ring-amber-500" : "focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      }`}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                {form.role !== 'admin' && (
                  <div className="pt-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block mb-2">
                      System Access Permissions
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {APPS.map((app) => {
                        const isSelected = form.allowedApps.split(',').filter(Boolean).includes(app.slug);
                        return (
                          <label key={app.slug} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? (editingUser ? "bg-amber-50 border-amber-200 shadow-sm" : "bg-red-50 border-red-200 shadow-sm") : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const current = form.allowedApps ? form.allowedApps.split(',').filter(Boolean) : [];
                                let next;
                                if (e.target.checked) next = [...current, app.slug];
                                else next = current.filter(s => s !== app.slug);
                                setForm({ ...form, allowedApps: next.join(',') });
                              }}
                              className={`h-4 w-4 rounded border-slate-300 text-${editingUser ? 'amber' : 'red'}-600 focus:ring-${editingUser ? 'amber' : 'red'}-500 transition-colors`}
                            />
                            <div className="flex items-center gap-2">
                              <app.icon className={`h-4 w-4 ${isSelected ? (editingUser ? "text-amber-600" : "text-red-600") : "text-slate-400"}`} />
                              <span className={`text-sm font-medium ${isSelected ? "text-slate-900" : "text-slate-600"}`}>{app.title}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    disabled={loading}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold uppercase tracking-widest text-white transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 ${
                      editingUser 
                        ? "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] focus:ring-amber-500" 
                        : "bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] focus:ring-red-500"
                    }`}
                  >
                    {editingUser ? (
                      <Save className="h-5 w-5" />
                    ) : (
                      <UserPlus className="h-5 w-5" />
                    )}
                    {loading
                      ? editingUser
                        ? "Saving..."
                        : "Deploying..."
                      : editingUser
                        ? "Save Protocol"
                        : "Deploy Trooper"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
