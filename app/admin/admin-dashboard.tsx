"use client";

import { useState } from "react";
import { Container } from "@/app/components/ui/container";
import { ArrowLeft, Shield, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/app/components/ui/badge";

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
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Active Users ({users.length})
            </h2>
            <div className="rounded-xl border border-line bg-surface/50 backdrop-blur-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-line">
                {users.map((user: any) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 hover:bg-line-subtle/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink">{user.name || "Unnamed"}</span>
                        {user.role === "admin" && (
                          <Badge tone="accent">Admin</Badge>
                        )}
                        {user.id === currentUser?.id && (
                          <Badge tone="live" dot>You</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted">{user.email}</div>
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
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
              Add New User
            </h2>
            <form onSubmit={handleCreate} className="rounded-xl border border-line bg-surface/50 backdrop-blur-xl p-5 shadow-sm space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                  {error}
                </div>
              )}
              
              <div>
                <label className="text-xs text-muted block mb-1.5">Name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-subtle"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-subtle"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1.5">Password</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-subtle"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-subtle appearance-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-2.5 text-sm font-medium text-bg transition-transform hover:scale-[1.02] active:scale-100 disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" />
                {loading ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
