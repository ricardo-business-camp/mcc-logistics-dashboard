import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';

// ─── Seeded PRNG (fallback when API is unreachable) ───────────────────────────
function createRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// MCC production workflow statuses (matches api/data.js)
const PRODUCTION_STATUSES = [
  'CREOPLATE', 'PRINTED', 'JOGGED', 'CUTTING', 'RECEIPTED', 'PICKED', 'CONFIRMED',
];

// ─── Static order data ────────────────────────────────────────────────────────
// Fields that never change on refresh. Dynamic fields (production,
// receipted) come from the server and are merged in buildDashboard().
const BASE_ORDERS = [
  { status: 'LATE',    cutoffH: 10, cutoffM: 0,  cutoffLabel: '10:00 AM', city: 'FREMONT',  delivery: '5871234', job: '4001234', product: 'LABEL ROLL 8.5x11',  timeInStatus: '6:45',  orderQty: 1500000, truck: 'SHUTTLE-Q3', customer: 'Acme Corp',        jobStart: '04/01/26 8:30 AM',  jobFinish: '04/02/26 2:45 PM',  dueDate: '04/02/26 10:00 AM', warehouse: 'MCC PLANT' },
  { status: 'ON TIME', cutoffH: 14, cutoffM: 0,  cutoffLabel: '2:00 PM',  city: 'LONDON',   delivery: '5874321', job: '4004321', product: 'CARDSTOCK 10x12',     timeInStatus: '3:22',  orderQty: 95000,   truck: 'SHIPPED',    customer: 'PrintCo Inc',      jobStart: '03/31/26 10:15 AM', jobFinish: '04/02/26 1:20 PM',  dueDate: '04/02/26 2:00 PM',  warehouse: 'EXTERNAL'   },
  { status: 'DELAYED', cutoffH: 14, cutoffM: 0,  cutoffLabel: '2:00 PM',  city: 'ORLANDO',  delivery: '5874312', job: '4004213', product: 'ENVELOPE PACK',       timeInStatus: '11:52', orderQty: 205000,  truck: '',           customer: 'Global Solutions', jobStart: '04/01/26 9:45 AM',  jobFinish: '04/02/26 12:30 PM', dueDate: '04/02/26 1:30 PM',  warehouse: 'EXTERNAL'   },
  { status: 'ON TIME', cutoffH: 16, cutoffM: 0,  cutoffLabel: '4:00 PM',  city: 'MARKHAM',  delivery: '5879631', job: '4005126', product: 'BUSINESS CARDS',      timeInStatus: '0:35',  orderQty: 30000,   truck: '',           customer: 'NextGen Services', jobStart: '04/02/26 7:00 AM',  jobFinish: '04/02/26 11:45 AM', dueDate: '04/02/26 4:00 PM',  warehouse: 'MCC PLANT' },
  { status: 'MOVED',   cutoffH: 10, cutoffM: 0,  cutoffLabel: '10:00 AM', city: 'BROOKLYN', delivery: '5873563', job: '4006589', product: 'POCKET FOLDER',       timeInStatus: '8:15',  orderQty: 300000,  truck: '',           customer: 'Elite Brands',     jobStart: '03/30/26 2:00 PM',  jobFinish: '04/01/26 4:30 PM',  dueDate: '04/01/26 10:00 AM', warehouse: 'MCC PLANT' },
  { status: 'ON TIME', cutoffH: 15, cutoffM: 15, cutoffLabel: '3:15 PM',  city: 'TORONTO',  delivery: '5875432', job: '4003456', product: 'FLYERS 8.5x11',       timeInStatus: '2:45',  orderQty: 500000,  truck: 'SHUTTLE-Q1', customer: 'Marketing Plus',   jobStart: '03/31/26 11:30 AM', jobFinish: '04/02/26 10:20 AM', dueDate: '04/02/26 3:15 PM',  warehouse: 'MCC PLANT' },
  { status: 'DELAYED', cutoffH: 12, cutoffM: 30, cutoffLabel: '12:30 PM', city: 'DETROIT',  delivery: '5872109', job: '4002987', product: 'POSTCARDS 5x7',       timeInStatus: '4:20',  orderQty: 250000,  truck: 'SHUTTLE-Q2', customer: 'Direct Mail Ltd',  jobStart: '04/01/26 1:00 PM',  jobFinish: '04/02/26 11:50 AM', dueDate: '04/02/26 12:30 PM', warehouse: 'EXTERNAL'   },
  { status: 'ON TIME', cutoffH: 17, cutoffM: 30, cutoffLabel: '5:30 PM',  city: 'CHICAGO',  delivery: '5876543', job: '4007654', product: 'BROCHURES TRI-FOLD',  timeInStatus: '1:05',  orderQty: 150000,  truck: 'SHUTTLE-Q3', customer: 'ProPrint Group',   jobStart: '04/02/26 6:45 AM',  jobFinish: '04/02/26 9:15 AM',  dueDate: '04/02/26 5:30 PM',  warehouse: 'MCC PLANT' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildDashboard(metrics, orderUpdates) {
  return {
    metrics,
    orders: BASE_ORDERS.map((order, i) => ({
      ...order,
      production: orderUpdates[i].production,
      // Convert server's percentage into an actual quantity
      receipted: Math.floor(order.orderQty * orderUpdates[i].receiptedPercent / 100),
    })),
  };
}

// ORDER STATUS per MCC proposal:
// READY  = receipted within 10% of order qty, or production is CONFIRMED/SHIPPED
// NOT READY = everything else
function getOrderStatus(order) {
  if (order.production === 'CONFIRMED' || order.truck === 'SHIPPED') return 'READY';
  if (order.receipted >= order.orderQty * 0.9)                       return 'READY';
  return 'NOT READY';
}

// Live countdown text + CSS class for each order row (called every second via ref)
function formatCountdown(cutoffH, cutoffM) {
  const now    = new Date();
  const cutoff = new Date();
  cutoff.setHours(cutoffH, cutoffM, 0, 0);
  const diff = cutoff - now;

  if (diff < 0) {
    const m = Math.floor(Math.abs(diff) / 60000);
    return { text: `-${m}m`, cls: 'countdown countdown-late' };
  }
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000)   / 1000);
  const text = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;
  return { text, cls: diff < 3600000 ? 'countdown countdown-caution' : 'countdown countdown-ok' };
}

// Simple Web Audio beep — fires when LATE orders are detected after a refresh
function playAlert() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (_) { /* browser may block without user gesture */ }
}

// ─── Client-side fallback (local dev / API unreachable) ───────────────────────
function generateFallback() {
  const rng = createRng(Math.floor(Date.now() / 30000));
  const metrics = {
    linesToday:    Math.floor(rng() * 50) + 260,
    ontimePercent: Math.floor(rng() * 20) + 75,
    atRisk:        Math.floor(rng() * 10) + 2,
    nextCutoff:    '2:00 PM',
  };
  const orderUpdates = Array.from({ length: 8 }, () => ({
    production:       PRODUCTION_STATUSES[Math.floor(rng() * PRODUCTION_STATUSES.length)],
    receiptedPercent: Math.floor(rng() * 100),
  }));
  return buildDashboard(metrics, orderUpdates);
}

// ─── Server fetch ─────────────────────────────────────────────────────────────
async function fetchFromServer() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { metrics, orderUpdates, msUntilNext } = await res.json();
    return { dashboard: buildDashboard(metrics, orderUpdates), msUntilNext };
  } catch {
    return { dashboard: generateFallback(), msUntilNext: 30000 - (Date.now() % 30000) };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const STATUS_FILTERS = ['ALL', 'LATE', 'DELAYED', 'ON TIME', 'MOVED'];

function App() {
  const [{ metrics, orders }, setDashboard] = useState(generateFallback);
  const [statusFilter,  setStatusFilter]    = useState('ALL');
  const [lastRefreshed, setLastRefreshed]   = useState(null);
  const prevLateCount = useRef(0);

  const clockRef     = useRef(null);
  const countdownMap = useRef({});   // delivery → <span> element

  // ── Clock + live countdown (direct DOM — zero React re-renders per tick) ──
  useEffect(() => {
    const tick = () => {
      if (clockRef.current) {
        const n = new Date();
        const d = `${String(n.getMonth()+1).padStart(2,'0')}/${String(n.getDate()).padStart(2,'0')}/${String(n.getFullYear()).slice(-2)}`;
        const t = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
        clockRef.current.textContent = `Date: ${d} | Time: ${t}`;
      }
      BASE_ORDERS.forEach(({ delivery, cutoffH, cutoffM }) => {
        const el = countdownMap.current[delivery];
        if (!el) return;
        const { text, cls } = formatCountdown(cutoffH, cutoffM);
        el.textContent  = text;
        el.className    = cls;
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Server refresh — chained to exact 30-second wall-clock boundaries ─────
  useEffect(() => {
    let timer;
    function scheduleNext(ms) {
      timer = setTimeout(async () => {
        const { dashboard, msUntilNext } = await fetchFromServer();
        setDashboard(dashboard);
        setLastRefreshed(new Date());
        // Beep if new LATE orders appeared since last refresh
        const lateNow = dashboard.orders.filter(o => o.status === 'LATE').length;
        if (lateNow > prevLateCount.current) playAlert();
        prevLateCount.current = lateNow;
        scheduleNext(msUntilNext);
      }, ms);
    }
    fetchFromServer().then(({ dashboard, msUntilNext }) => {
      setDashboard(dashboard);
      setLastRefreshed(new Date());
      prevLateCount.current = dashboard.orders.filter(o => o.status === 'LATE').length;
      scheduleNext(msUntilNext);
    });
    return () => clearTimeout(timer);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const statusCounts = useMemo(() => {
    const c = { ALL: orders.length, LATE: 0, DELAYED: 0, 'ON TIME': 0, MOVED: 0 };
    orders.forEach(o => { if (c[o.status] !== undefined) c[o.status]++; });
    return c;
  }, [orders]);

  const filteredOrders = useMemo(() =>
    statusFilter === 'ALL' ? orders : orders.filter(o => o.status === statusFilter),
    [orders, statusFilter]
  );

  const lateCount = statusCounts.LATE;

  const getRowClass = s => ({ LATE: 'row-late', DELAYED: 'row-delayed', 'ON TIME': 'row-ontime', MOVED: 'row-moved' }[s] || '');

  return (
    <div className="dashboard">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="dashboard-header">
        <h1>MCC LOGISTICS COMMAND CENTRE</h1>
        <div className="header-info">
          <span className="date" ref={clockRef}></span>
          <span className="conn-badge">
            {lastRefreshed ? `Updated: ${lastRefreshed.toLocaleTimeString()}` : 'Connecting…'}
          </span>
        </div>
      </div>

      {/* ── METRICS ────────────────────────────────────────────────── */}
      <div className="metrics-section">
        <div className="metric-card">
          <div className="metric-label">LINES TODAY</div>
          <div className="metric-value">{metrics.linesToday}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ON-TIME %</div>
          <div className="metric-value metric-green">{metrics.ontimePercent}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">AT RISK</div>
          <div className="metric-value metric-red">{metrics.atRisk}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">NEXT CUT-OFF</div>
          <div className="metric-value">{metrics.nextCutoff}</div>
        </div>
      </div>

      {/* ── LATE ALERT BANNER ───────────────────────────────────────── */}
      {lateCount > 0 && (
        <div className="alert-banner">
          ⚠ ALERT: {lateCount} order{lateCount !== 1 ? 's have' : ' has'} passed cut-off — Immediate action required
        </div>
      )}

      {/* ── FILTER BAR ─────────────────────────────────────────────── */}
      <div className="filter-bar">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={[
              'filter-btn',
              `filter-${f.toLowerCase().replace(' ', '-')}`,
              statusFilter === f ? 'active' : '',
            ].join(' ')}
          >
            {f} <span className="filter-count">{statusCounts[f] ?? 0}</span>
          </button>
        ))}
        <span className="last-refreshed">
          {lastRefreshed ? `Last updated: ${lastRefreshed.toLocaleTimeString()}` : ''}
        </span>
      </div>

      {/* ── TABLE ──────────────────────────────────────────────────── */}
      <div className="table-section">
        <table className="shipping-table">
          <thead>
            <tr>
              <th>STATUS</th>
              <th>CUT-OFF</th>
              <th>TIME LEFT</th>
              <th>CITY</th>
              <th>DELIVERY #</th>
              <th>JOB #</th>
              <th>PRODUCT</th>
              <th>PRODUCTION</th>
              <th>TIME IN STATUS</th>
              <th>RECEIPTED</th>
              <th>ORDER QTY</th>
              <th>ORDER STATUS</th>
              <th>TRUCK</th>
              <th>CUSTOMER</th>
              <th>JOB START</th>
              <th>JOB FINISH</th>
              <th>DUE DATE</th>
              <th>WAREHOUSE</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.delivery} className={getRowClass(order.status)}>
                <td><span className="status-badge">{order.status}</span></td>
                <td>{order.cutoffLabel}</td>
                <td>
                  <span ref={el => { countdownMap.current[order.delivery] = el; }} className="countdown" />
                </td>
                <td>{order.city}</td>
                <td>{order.delivery}</td>
                <td>{order.job}</td>
                <td>{order.product}</td>
                <td>{order.production}</td>
                <td>{order.timeInStatus}</td>
                <td>{order.receipted.toLocaleString()}</td>
                <td>{order.orderQty.toLocaleString()}</td>
                <td>
                  <span className={`order-status ${getOrderStatus(order) === 'READY' ? 'order-ready' : 'order-not-ready'}`}>
                    {getOrderStatus(order)}
                  </span>
                </td>
                <td>{order.truck}</td>
                <td>{order.customer}</td>
                <td>{order.jobStart}</td>
                <td>{order.jobFinish}</td>
                <td>{order.dueDate}</td>
                <td>{order.warehouse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <div className="dashboard-footer">
        <div className="footer-status">
          <span className="status-item si-ontime">✓ On Time</span>
          <span className="status-item si-delayed">⚠ Delayed (&lt;1 hr)</span>
          <span className="status-item si-late">🔴 Late (Past Cut-Off)</span>
          <span className="status-item si-moved">↻ Moved</span>
          <span className="status-item si-webhook">🔗 n8n Webhook Ready</span>
          <span className="status-item si-warehouse">🏭 Warehouse Tracking Active</span>
          <span className="status-item si-refresh">🔄 Auto-Refresh Every 30s</span>
          <span className="status-item si-external">🚚 External Warehouse Visibility</span>
        </div>
      </div>

    </div>
  );
}

export default App;
