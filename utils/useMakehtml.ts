import { ActiveMedicine, HighRiskDocument, PatientSummary } from "@/db/patient_summary";

const COLORS = {
  dark: "#0D483F",
  darker: "#0D1F1C",
  panel: "#234338",
  lime: "#D9F99D",
  limeSoft: "#EEF6A2",
  offWhite: "#FAFAF8",
};

const formatDate = (d: string) => {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const endDate = (start: string, days: number | null) => {
  if (!days) return "Ongoing";
  const d = new Date(start);
  if (isNaN(d.getTime())) return "—";
  d.setDate(d.getDate() + days);
  return formatDate(d.toISOString());
};

const medicineRow = (m: ActiveMedicine) => `
  <tr>
    <td class="cell name">${escapeHtml(m.name)}</td>
    <td class="cell">${escapeHtml(m.dosage ?? "—")}</td>
    <td class="cell">${escapeHtml(m.frequency ?? "—")}</td>
    <td class="cell">${formatDate(m.start_date)}</td>
    <td class="cell">${endDate(m.start_date, m.duration_days)}</td>
  </tr>`;

const highRiskCard = (doc: HighRiskDocument) => `
  <div class="doc-card">
    <div class="doc-card-header">
      <span class="doc-title">${escapeHtml(doc.title)}</span>
      <span class="badge">${escapeHtml(doc.type)}</span>
    </div>
    <div class="doc-meta">${formatDate(doc.date)}${doc.doctor_name ? " · " + escapeHtml(doc.doctor_name) : ""}${doc.hospital_name ? " · " + escapeHtml(doc.hospital_name) : ""}</div>
    ${doc.diagnosis ? `<div class="doc-line"><strong>Diagnosis:</strong> ${escapeHtml(doc.diagnosis)}</div>` : ""}
    ${doc.findings ? `<div class="doc-line"><strong>Findings:</strong> ${escapeHtml(doc.findings)}</div>` : ""}
    ${doc.impression ? `<div class="doc-line"><strong>Impression:</strong> ${escapeHtml(doc.impression)}</div>` : ""}
  </div>`;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const buildHtml = (summary: PatientSummary): string => {
  const meds = summary.activeMedicines.length
    ? summary.activeMedicines.map(medicineRow).join("")
    : `<tr><td class="cell empty" colspan="5">No active medicines</td></tr>`;

  const docs = summary.highRiskDocuments.length
    ? summary.highRiskDocuments.map(highRiskCard).join("")
    : `<div class="empty">No high-risk documents</div>`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { margin: 28px 32px; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Aeonik', -apple-system, sans-serif;
    background: ${COLORS.offWhite};
    color: ${COLORS.darker};
    margin: 0;
    padding: 0;
  }
  .header {
    background: ${COLORS.dark};
    color: ${COLORS.offWhite};
    padding: 24px 28px;
    border-radius: 12px;
    margin-bottom: 20px;
  }
  .header h1 { margin: 0 0 4px 0; font-size: 22px; font-weight: 700; }
  .header p { margin: 0; font-size: 12px; color: ${COLORS.limeSoft}; }
  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: ${COLORS.dark};
    margin: 20px 0 10px 0;
    padding-bottom: 6px;
    border-bottom: 2px solid ${COLORS.lime};
  }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    background: ${COLORS.panel};
    color: ${COLORS.offWhite};
    text-align: left;
    font-size: 11px;
    padding: 8px 10px;
  }
  thead th:first-child { border-radius: 6px 0 0 6px; }
  thead th:last-child { border-radius: 0 6px 6px 0; }
  .cell { padding: 8px 10px; font-size: 12px; border-bottom: 1px solid #E2E8E4; }
  .cell.name { font-weight: 600; }
  .cell.empty { text-align: center; color: #667; padding: 16px; }
  .doc-card {
    background: white;
    border: 1px solid #E2E8E4;
    border-left: 4px solid ${COLORS.dark};
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }
  .doc-card-header { display: flex; justify-content: space-between; align-items: center; }
  .doc-title { font-size: 13px; font-weight: 700; color: ${COLORS.darker}; }
  .badge {
    background: ${COLORS.lime};
    color: ${COLORS.darker};
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    text-transform: uppercase;
  }
  .doc-meta { font-size: 11px; color: #667; margin: 4px 0 6px 0; }
  .doc-line { font-size: 12px; margin-top: 2px; }
  .empty { font-size: 12px; color: #667; padding: 10px 0; }
  .footer { margin-top: 24px; font-size: 10px; color: #889; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <h1>Doctor Visit Summary</h1>
    <p>Generated ${formatDate(summary.generatedAt)} · MedVault-AI</p>
  </div>

  <div class="section-title">Active Medicines</div>
  <table>
    <thead>
      <tr>
        <th>Name</th><th>Dosage</th><th>Frequency</th><th>Start</th><th>Until</th>
      </tr>
    </thead>
    <tbody>${meds}</tbody>
  </table>

  <div class="section-title">High-Risk Documents</div>
  ${docs}

  <div class="footer">Generated locally on-device by MedVault-AI. Not a substitute for professional medical advice.</div>
</body>
</html>`;
};
