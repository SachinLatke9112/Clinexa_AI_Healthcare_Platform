import React from 'react';
import { hospitalMock } from '../data/mockData';
import { Activity, BedDouble, Users, UserPlus, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

const pctOf = (part, total) => (total ? Math.round((part / total) * 100) : 0);
const levelTone = (pct) => (pct >= 90 ? 'red' : pct >= 75 ? 'amber' : 'green');

const StatCard = ({ title, value, icon, subtitle, tone = 'blue', pct }) => (
  <div className="card stat-card" data-tone={tone}>
    <div className="stat-top">
      <div>
        <h4 className="stat-title">{title}</h4>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-icon" aria-hidden="true">{icon}</div>
    </div>
    {pct != null && (
      <div className="meter" role="img" aria-label={`${pct}% occupied`}>
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
    )}
    {subtitle && <p className="stat-sub">{subtitle}</p>}
  </div>
);

const BedGrid = ({ total, occupied, icu }) => (
  <div
    className={`bed-grid ${icu ? 'is-icu' : ''}`}
    role="img"
    aria-label={`${occupied} of ${total} beds occupied`}
  >
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`bed ${i < occupied ? 'is-occupied' : ''}`}
        title={`Bed ${i + 1} — ${i < occupied ? 'occupied' : 'available'}`}
      />
    ))}
  </div>
);

export default function HospitalDashboard() {
  const { name, stats, diseaseTrends } = hospitalMock;

  const bedPct = pctOf(stats.occupiedBeds, stats.totalBeds);
  const icuPct = pctOf(stats.icuOccupied, stats.icuBeds);
  const maxCount = Math.max(1, ...diseaseTrends.map(t => t.count));

  // Alerts derived from the data above
  const alerts = [];
  if (icuPct >= 90) {
    alerts.push({ text: `ICU at ${icuPct}% — ${stats.icuBeds - stats.icuOccupied} beds left`, critical: true });
  }
  diseaseTrends
    .filter(t => t.trend === 'up')
    .forEach(t => alerts.push({ text: `${t.condition} rising ${t.percentage}`, critical: false }));

  return (
    <div className="flex-col gap-6 h-full" style={{ height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
      {/* Header */}
      <div className="card hospital-header glass-panel" style={{ flexShrink: 0 }}>
        <div>
          <h1 className="heading-2 flex items-center gap-2">
            <Activity color="var(--primary)" /> {name}
          </h1>
          <p className="text-muted mt-1">Live Resource & Trend Dashboard</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {alerts.slice(0, 3).map((a, i) => (
            <span key={i} className={`alert-pill ${a.critical ? 'is-critical' : ''}`}>
              <AlertTriangle size={14} /> {a.text}
            </span>
          ))}
          <span className="live-pill"><span className="live-dot" /> Live</span>
        </div>
      </div>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', flexShrink: 0 }}>
        <StatCard
          title="Total Beds (Occupied)"
          value={`${stats.occupiedBeds} / ${stats.totalBeds}`}
          icon={<BedDouble size={26} />}
          subtitle={`${stats.totalBeds - stats.occupiedBeds} available · ${bedPct}% occupied`}
          tone={levelTone(bedPct)}
          pct={bedPct}
        />
        <StatCard
          title="ICU Beds (Occupied)"
          value={`${stats.icuOccupied} / ${stats.icuBeds}`}
          icon={<Activity size={26} />}
          subtitle={`${stats.icuBeds - stats.icuOccupied} available · ${icuPct}% occupied`}
          tone={levelTone(icuPct)}
          pct={icuPct}
        />
        <StatCard
          title="Active Doctors"
          value={stats.activeDoctors}
          icon={<Users size={26} />}
          subtitle="On duty now"
          tone="green"
        />
        <StatCard
          title="Waiting Patients"
          value={stats.waitingPatients}
          icon={<UserPlus size={26} />}
          subtitle="Across all departments"
          tone="amber"
        />
      </div>

      <div className="hospital-bottom mt-2">
        {/* Disease Trends */}
        <div className="card p-6" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
          <h3 className="heading-3 flex items-center gap-2 mb-6">
            <Activity color="var(--primary)" /> Live Disease Trends
          </h3>

          <div className="flex-col gap-4">
            {diseaseTrends.map((trend, idx) => (
              <div key={idx} className="trend-row" data-trend={trend.trend}>
                <div className="trend-top">
                  <div>
                    <h4 className="font-semibold text-lg">{trend.condition}</h4>
                    <span className="text-muted">{trend.count} active cases</span>
                  </div>
                  <span className="trend-chip" data-trend={trend.trend}>
                    {trend.trend === 'up' && <TrendingUp size={16} />}
                    {trend.trend === 'down' && <TrendingDown size={16} />}
                    {trend.trend === 'stable' && <Minus size={16} />}
                    {trend.percentage}
                  </span>
                </div>
                <div className="trend-bar" role="img" aria-label={`${trend.count} of ${maxCount} peak`}>
                  <div style={{ width: `${Math.round((trend.count / maxCount) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bed occupancy map */}
        <div className="card p-6" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
          <h3 className="heading-3 flex items-center gap-2 mb-2">
            <BedDouble color="var(--primary)" /> Bed Occupancy
          </h3>
          <div className="bed-legend mb-4">
            <span className="flex items-center gap-2"><span className="legend-dot" style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }} /> Available</span>
            <span className="flex items-center gap-2"><span className="legend-dot" style={{ background: '#2563eb' }} /> Occupied</span>
            <span className="flex items-center gap-2"><span className="legend-dot" style={{ background: '#ef4444' }} /> ICU occupied</span>
          </div>

          <div className="bed-section">
            <div className="bed-head">
              <h4 className="font-semibold">General wards</h4>
              <span className="text-sm text-muted">{stats.occupiedBeds} of {stats.totalBeds} · {bedPct}%</span>
            </div>
            <BedGrid total={stats.totalBeds} occupied={stats.occupiedBeds} />
          </div>

          <div className="bed-section">
            <div className="bed-head">
              <h4 className="font-semibold">Intensive care</h4>
              <span className="text-sm text-muted">{stats.icuOccupied} of {stats.icuBeds} · {icuPct}%</span>
            </div>
            <BedGrid total={stats.icuBeds} occupied={stats.icuOccupied} icu />
          </div>
        </div>
      </div>
    </div>
  );
}