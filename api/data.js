// api/data.js — Vercel serverless function
// Generates dashboard data server-side so every device receives identical
// numbers. Seeds from the current 30-second wall-clock window; all callers
// in the same window get byte-for-byte identical JSON.

// MCC's actual production workflow statuses (from proposal)
const PRODUCTION_STATUSES = [
  'CREOPLATE', 'PRINTED', 'JOGGED', 'CUTTING', 'RECEIPTED', 'PICKED', 'CONFIRMED',
];

function createRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

module.exports = function handler(req, res) {
  const now  = Date.now();
  const seed = Math.floor(now / 30000);
  const rng  = createRng(seed);

  const metrics = {
    linesToday:    Math.floor(rng() * 50)  + 260,
    ontimePercent: Math.floor(rng() * 20)  + 75,
    atRisk:        Math.floor(rng() * 10)  + 2,
    nextCutoff:    '2:00 PM',
  };

  // Dynamic per-order fields for each of the 8 static orders.
  // receiptedPercent (0-100) lets the client compute the actual receipted
  // quantity against its own orderQty — no duplication of static data.
  const orderUpdates = Array.from({ length: 8 }, () => {
    const production      = PRODUCTION_STATUSES[Math.floor(rng() * PRODUCTION_STATUSES.length)];
    // Weight receipted % toward high values when near completion
    const receiptedPercent = production === 'CONFIRMED' || production === 'PICKED'
      ? Math.floor(rng() * 15) + 85          // 85-100 % when picked/confirmed
      : Math.floor(rng() * 100);             // 0-100 % otherwise
    return { production, receiptedPercent };
  });

  // Tell the client exactly how many ms until the next 30-second boundary
  // so it can schedule its next fetch with zero drift.
  const msUntilNext = ((seed + 1) * 30000) - now;

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ metrics, orderUpdates, msUntilNext });
};
