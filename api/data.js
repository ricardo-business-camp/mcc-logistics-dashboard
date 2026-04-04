// api/data.js — Vercel serverless function
// Generates dashboard metrics deterministically from the current 30-second
// wall-clock window. Every device that calls this endpoint in the same window
// receives byte-for-byte identical JSON, so all screens always agree.

const PRODUCTION_STATUSES = [
  'CUTTING', 'JOGGED', 'PRINTING', 'CREOPLATEING', 'DIECUTTING', 'RECONCILING',
];

function createRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

module.exports = function handler(req, res) {
  const now   = Date.now();
  const seed  = Math.floor(now / 30000);          // same for every caller in this window
  const rng   = createRng(seed);

  const metrics = {
    linesToday:    Math.floor(rng() * 50) + 260,
    ontimePercent: Math.floor(rng() * 20) + 75,
    atRisk:        Math.floor(rng() * 10) + 2,
    nextCutoff:    '2:00 PM',
  };

  // Dynamic per-order fields (one set for each of the 8 static orders)
  const orderUpdates = Array.from({ length: 8 }, () => ({
    readyPercent: Math.floor(rng() * 100) + 1,
    production:   PRODUCTION_STATUSES[Math.floor(rng() * PRODUCTION_STATUSES.length)],
  }));

  // Tell the client exactly how many ms until the next window so it can
  // schedule its next fetch precisely — no polling, no drift.
  const msUntilNext = ((seed + 1) * 30000) - now;

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ metrics, orderUpdates, msUntilNext });
};
