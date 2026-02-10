'use client';

import { useEffect, useMemo, useState } from 'react';
import { DollarSign, Loader2, Mail } from 'lucide-react';
import { getTellerDashboard, type TellerDashboard } from '../actions/teller';
import { PageHeader } from '../components';
import { formatRelativeTime } from '../lib/format';

function formatCurrency(amount: number | null, currency?: string | null) {
  if (amount == null) return '-';
  const code = currency || 'USD';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(amount);
  } catch {
    return `${code} ${amount.toFixed(2)}`;
  }
}

function statusStyle(status: string | null) {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('fail') || normalized.includes('canceled')) {
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
  if (normalized.includes('due') || normalized.includes('past')) {
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }
  if (normalized.includes('active')) {
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
  return 'bg-white/10 text-white/50 border-white/10';
}

export default function TellerPage() {
  const [dashboard, setDashboard] = useState<TellerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { data, error: err } = await getTellerDashboard();
    if (err) {
      setError(err);
    } else {
      setError(null);
      setDashboard(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const knownAmounts = useMemo(() => {
    const amounts = new Set<number>();
    dashboard?.subscriptions.forEach((sub) => {
      if (sub.amount != null) amounts.add(sub.amount);
    });
    return amounts;
  }, [dashboard]);

  const hasAmountMismatch = (subject: string | null) => {
    if (!subject || knownAmounts.size === 0) return false;
    const match = subject.match(/(\d+(?:\.\d{1,2})?)/);
    if (!match) return false;
    const value = Number(match[1]);
    if (Number.isNaN(value)) return false;
    return !Array.from(knownAmounts).some((amt) => Math.abs(amt - value) < 0.01);
  };

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>Failed to load teller dashboard: {error}</p>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        icon={DollarSign}
        iconColor="text-amber-400"
        title="TellerGolem"
        onRefresh={refresh}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto space-y-6 pb-8">
        {/* Section A: Subscription Tracker */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wider text-white/40">Monthly Total</div>
            <div className="text-2xl font-bold text-white mt-1">
              ${dashboard.monthlyTotal.toFixed(2)} / mo
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Service</th>
                  <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Frequency</th>
                  <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Last Payment</th>
                  <th className="text-left py-2 px-3 text-xs text-white/50 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-white/50">
                      No subscriptions found
                    </td>
                  </tr>
                ) : (
                  dashboard.subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-white/5">
                      <td className="py-2 px-3 text-white/70">{sub.service_name}</td>
                      <td className="py-2 px-3 text-white/60">
                        {formatCurrency(sub.amount, sub.currency)}
                      </td>
                      <td className="py-2 px-3 text-white/60">{sub.frequency || '-'}</td>
                      <td className="py-2 px-3 text-white/60">
                        {sub.last_payment ? formatRelativeTime(sub.last_payment) : '-'}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyle(sub.status)}`}>
                          {sub.status || 'unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section B: Recent Subscription Emails */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-400" />
            Recent Subscription Emails
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            {dashboard.recentSubscriptionEmails.length === 0 ? (
              <p className="text-sm text-white/50 text-center py-6">
                No subscription emails in the last 30 days
              </p>
            ) : (
              <div className="space-y-2">
                {dashboard.recentSubscriptionEmails.map((email) => {
                  const highlight = hasAmountMismatch(email.subject);
                  return (
                    <div
                      key={email.id}
                      className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                        highlight
                          ? 'border-amber-500/40 bg-amber-500/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{email.subject || '(no subject)'}</p>
                        <p className="text-xs text-white/50 truncate">{email.from_address || 'Unknown sender'}</p>
                      </div>
                      <div className="text-xs text-white/40 whitespace-nowrap">
                        {formatRelativeTime(email.received_at)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
