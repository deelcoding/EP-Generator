import { WORK_ROLES } from '../constants';

// ─── Helper Functions ───
export const fmt = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const fmtPct = (n) => isFinite(n) ? (n * 100).toFixed(1) + "%" : "—";

export const today = () => new Date().toISOString().split("T")[0];

export const addDays = (d, n) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
};

export const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d + "T12:00:00");
  return dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

export function getRateForType(role, workType, discountRate = 0) {
  const r = WORK_ROLES.find(w => w.role === role);
  if (!r) return 0;
  const stdRate = discountRate > 0 ? r.baseRate * (1 - discountRate) : r.baseRate;
  if (workType === "Proj. Normal") return stdRate;
  if (workType === "Proj. Overtime") return stdRate * 1.5;
  if (workType === "Design Eng (ER)") return stdRate * 0.75;
  if (workType === "Project Management") return stdRate;
  return stdRate;
}

export function getCostForType(role, workType) {
  const r = WORK_ROLES.find(w => w.role === role);
  if (!r) return 0;
  if (workType === "Proj. Normal" || workType === "Project Management") return r.weightedCost;
  if (workType === "Proj. Overtime") return r.weightedCost;
  if (workType === "Design Eng (ER)") return r.weightedCost * 0.75;
  return r.weightedCost;
}
