import { useState, useMemo } from "react";
import { generateProposalDocx, downloadDocx } from "./utils/proposalGenerator";
import {
  WORK_ROLES,
  WORK_TYPES,
  CONTACTS,
  CLIENT_RESPONSIBILITIES,
  PROJECT_ASSUMPTIONS,
  TABS,
  colors,
} from "./constants";
import { fmt, fmtPct, today, addDays, getRateForType } from "./utils/helpers";
import { Card, Field, Input, Select } from "./components/ui";
import { styles } from "./utils/styles";
import ResponsibilitiesTab from "./components/ResponsiblitiesTab";
import matrixLogo from "./assets/Matrix_Logo_Alabaster.png";

// ─── Main Component ───
export default function ALQEApp() {
  const [tab, setTab] = useState(0);
  const [generating, setGenerating] = useState(false);

  // Project Info
  const [projectInfo, setProjectInfo] = useState({
    createdDate: today(),
    customerName: "",
    opportunityName: "",
    designEngineer: "",
    implementationEngineer: "",
    secondaryEngineer: "",
    clientExecutive: "",
    workLocation: "Remote",
    projectBackground: "",
    projectNotes: "",
    discountRate: 0,
    riskFactor: "High",
    fairMarketUplift: 4000,
    billOfMaterialsRef: "",
  });

  // SOW items (scope of work task lines)
  const [sowItems, setSowItems] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      task: "",
      workRole: "Engineer III",
      workType: "Proj. Normal",
      hours: 0,
    })),
  );

  // PM Tasks (auto-calculated)
  const [pmOverrides, setPmOverrides] = useState({
    thirdPartyCoord: 0,
    additionalSync: 0,
    day2Standby: 0,
  });

  // Additional labor items
  const [expenses, setExpenses] = useState({
    hotelCost: 0,
    hotelQty: 0,
    perDiemCost: 0,
    perDiemQty: 0,
    travel1Role: "Engineer III",
    travel1Qty: 0,
    travel2Role: "Engineer III",
    travel2Qty: 0,
  });

  // Subcontractors
  const [subs, setSubs] = useState([
    { name: "", cost: 0 },
    { name: "", cost: 0 },
    { name: "", cost: 0 },
  ]);

  // Custom Client Responsibilities & Assumptions
  const [customResponsibilities, setCustomResponsibilities] = useState([
    ...CLIENT_RESPONSIBILITIES,
  ]);
  const [customAssumptions, setCustomAssumptions] = useState([
    ...PROJECT_ASSUMPTIONS,
  ]);

  // Get CE contact info
  const ceContact = useMemo(() => {
    return CONTACTS.find((c) => c.name === projectInfo.clientExecutive) || null;
  }, [projectInfo.clientExecutive]);

  // Calculate expiration date (30 days from created)
  const expDate = useMemo(() => {
    return addDays(projectInfo.createdDate, 30);
  }, [projectInfo.createdDate]);

  // ─── Calculations ───
  const calculations = useMemo(() => {
    const discount = projectInfo.discountRate / 100;

    const totalSowHours = sowItems.reduce(
      (s, item) => s + (parseFloat(item.hours) || 0),
      0,
    );

    // PM Hours calculations
    const pmIko =
      totalSowHours <= 8
        ? 0
        : Math.min(
            1,
            Math.max(
              0.5,
              Math.round(
                (totalSowHours > 24
                  ? totalSowHours * 0.05
                  : totalSowHours * 0.0375) * 4,
              ) / 4,
            ),
          );
    const pmEko = pmIko;
    const pmCloseout = pmIko;
    const pmCoordBase =
      totalSowHours > 8
        ? Math.round(
            Math.max(0, totalSowHours * 0.1 - pmIko - pmEko - pmCloseout) * 4,
          ) / 4
        : 0;
    const pmCoord = Math.max(0, pmCoordBase);
    const pm3rd = parseFloat(pmOverrides.thirdPartyCoord) || 0;

    const totalPmHours = pmIko + pmEko + pmCoord + pmCloseout + pm3rd;

    // Eng Hours calculations
    const engIko = pmIko;
    const engEko = pmEko;
    const engCoord =
      totalSowHours > 8
        ? Math.round(
            Math.max(0, totalSowHours * 0.1 - pmIko - pmEko - pmCloseout) * 4,
          ) / 4
        : 0;
    const engCloseout = pmCloseout;
    const eng3rd = parseFloat(pmOverrides.thirdPartyCoord) || 0;
    const engAddSync = parseFloat(pmOverrides.additionalSync) || 0;
    const engDay2 = parseFloat(pmOverrides.day2Standby) || 0;

    const totalEngHours =
      engIko + engEko + engCoord + engCloseout + eng3rd + engAddSync + engDay2;

    // PM Labor costs
    const pmRole = WORK_ROLES.find((r) => r.role === "Project Management");
    const pmCost = totalPmHours * (pmRole?.weightedCost || 70);
    const pmSell = totalPmHours * (pmRole?.baseRate || 100);

    // SOW Labor calculations
    let sowCost = 0;
    let sowSell = 0;
    sowItems.forEach((item) => {
      const hours = parseFloat(item.hours) || 0;
      const role = WORK_ROLES.find((r) => r.role === item.workRole);
      if (role && hours > 0) {
        const rate = getRateForType(role, item.workType);
        sowCost += hours * role.weightedCost;
        sowSell += hours * rate;
      }
    });

    // Eng Overhead Labor
    const engRole = WORK_ROLES.find((r) => r.role === "Engineer III");
    const engCost = totalEngHours * (engRole?.weightedCost || 156);
    const engSell = totalEngHours * (engRole?.baseRate || 225);

    // Total Labor
    const laborCostTotal = pmCost + sowCost + engCost;
    const laborSellTotal = pmSell + sowSell + engSell;

    // Expenses
    const hotelCost =
      (parseFloat(expenses.hotelCost) || 0) *
      (parseFloat(expenses.hotelQty) || 0);
    const hotelSell = Math.ceil(hotelCost * 1.15 * 4) / 4;

    const perDiemCost =
      (parseFloat(expenses.perDiemCost) || 0) *
      (parseFloat(expenses.perDiemQty) || 0);
    const perDiemSell = Math.ceil(perDiemCost * 1.15 * 4) / 4;

    const travel1Role = WORK_ROLES.find((r) => r.role === expenses.travel1Role);
    const travel1Cost =
      (travel1Role?.travelCost || 87.5) *
      (parseFloat(expenses.travel1Qty) || 0);
    const travel1Sell =
      (travel1Role?.travelRate || 125) * (parseFloat(expenses.travel1Qty) || 0);

    const travel2Role = WORK_ROLES.find((r) => r.role === expenses.travel2Role);
    const travel2Cost =
      (travel2Role?.travelCost || 87.5) *
      (parseFloat(expenses.travel2Qty) || 0);
    const travel2Sell =
      (travel2Role?.travelRate || 125) * (parseFloat(expenses.travel2Qty) || 0);

    const miscCostTotal = hotelCost + perDiemCost + travel1Cost + travel2Cost;
    const miscSellTotal = hotelSell + perDiemSell + travel1Sell + travel2Sell;

    // Subcontractors
    const subCostTotal = subs.reduce(
      (s, sub) => s + (parseFloat(sub.cost) || 0),
      0,
    );
    const subSellTotal = Math.ceil(subCostTotal * 1.15 * 4) / 4;

    // Risk factor
    const riskMultiplier =
      projectInfo.riskFactor === "High"
        ? 0.15
        : projectInfo.riskFactor === "Medium"
          ? 0.1
          : 0.05;
    const riskAmount = laborSellTotal * riskMultiplier;
    const laborSellWithRisk = laborSellTotal + riskAmount;

    // Fair Market Uplift
    const fmu = parseFloat(projectInfo.fairMarketUplift) || 0;

    // Grand Total (rounded to nearest 0.25)
    const grandTotal =
      Math.ceil((laborSellWithRisk + miscSellTotal + subSellTotal + fmu) * 4) /
      4;

    // Apply discount
    const discountAmount = grandTotal * discount;
    const finalTotal = grandTotal - discountAmount;

    // Profit calculations
    const totalCost = laborCostTotal + miscCostTotal + subCostTotal;
    const estProfit = finalTotal - totalCost;
    const profitMargin = finalTotal > 0 ? (estProfit / finalTotal) * 100 : 0;

    return {
      // Hours
      totalSowHours,
      totalPmHours,
      totalEngHours,
      totalHours: totalSowHours + totalPmHours + totalEngHours,

      // PM breakdown
      pmIko,
      pmEko,
      pmCoord,
      pmCloseout,
      pm3rd,

      // Eng breakdown
      engIko,
      engEko,
      engCoord,
      engCloseout,
      eng3rd,
      engAddSync,
      engDay2,

      // Labor costs
      pmCost,
      pmSell,
      sowCost,
      sowSell,
      engCost,
      engSell,
      laborCostTotal,
      laborSellTotal,
      laborSellWithRisk,

      // Expenses
      hotelCost,
      hotelSell,
      perDiemCost,
      perDiemSell,
      travel1Cost,
      travel1Sell,
      travel2Cost,
      travel2Sell,
      miscCostTotal,
      miscSellTotal,

      // Subs
      subCostTotal,
      subSellTotal,

      // Risk & FMU
      riskAmount,
      fmu,

      // Totals
      grandTotal,
      discountAmount,
      finalTotal,
      totalCost,
      estProfit,
      profitMargin,
    };
  }, [projectInfo, sowItems, pmOverrides, expenses, subs]);

  // ─── SOW Item Handlers ───
  const updateSowItem = (id, field, value) => {
    setSowItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const addSowItem = () => {
    setSowItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        task: "",
        workRole: "Engineer III",
        workType: "Proj. Normal",
        hours: 0,
      },
    ]);
  };

  const removeSowItem = (id) => {
    setSowItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ─── Generate Proposal ───
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const blob = await generateProposalDocx({
        projectInfo,
        ceContact,
        calculations,
        sowItems,
        customResponsibilities,
        customAssumptions,
        expDate,
        getRateForType,
      });

      const filename = `EP - ${projectInfo.customerName || "Proposal"} - ${
        projectInfo.opportunityName?.split(" – ")[0] || "Draft"
      } - ${projectInfo.createdDate.replace(/-/g, "")}.docx`;
      downloadDocx(blob, filename);
    } catch (err) {
      console.error("Error generating proposal:", err);
      alert("Failed to generate proposal: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.ebony} 0%, ${colors.jet} 100%)`,
          borderBottom: `1px solid ${colors.border}`,
          padding: "16px 24px",
        }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}>
          {/* Left - Title */}
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: colors.white,
                margin: 0,
                letterSpacing: "-0.02em",
              }}>
              <span>Labor Quote Estimator</span>
            </h1>
            <p
              style={{
                fontSize: 12,
                color: colors.textDim,
                margin: "4px 0 0",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
              Engagement Proposal Generator &bull; v1.0
            </p>
          </div>

          {/* Center - Logo */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}>
            <a
              href="https://www.matrixintegration.com"
              target="_blank"
              rel="noopener noreferrer">
              <img
                src={matrixLogo}
                alt="Matrix Integration"
                style={{ height: 40, width: "auto", cursor: "pointer" }}
              />
            </a>
          </div>

          {/* Right - Stats */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                background: colors.accentGlow,
                border: `1px solid ${colors.accent}33`,
                borderRadius: 8,
                padding: "8px 14px",
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: 11,
                  color: colors.textDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                Grand Total
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: colors.accent,
                  fontVariantNumeric: "tabular-nums",
                }}>
                {fmt(calculations.grandTotal)}
              </div>
            </div>
            <div
              style={{
                background: colors.greenGlow,
                border: `1px solid ${colors.green}33`,
                borderRadius: 8,
                padding: "8px 14px",
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: 11,
                  color: colors.textDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                Est. Profit
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: colors.green,
                  fontVariantNumeric: "tabular-nums",
                }}>
                {fmt(calculations.estProfit)}
              </div>
            </div>
            <div
              style={{
                background: `${colors.orange}12`,
                border: `1px solid ${colors.orange}33`,
                borderRadius: 8,
                padding: "8px 14px",
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: 11,
                  color: colors.textDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                Total Hours
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: colors.orange,
                  fontVariantNumeric: "tabular-nums",
                }}>
                {fmt(calculations.totalHours.toFixed(1))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        <div style={styles.tabContainer}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              style={styles.tab(tab === i)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        {tab === 0 && (
          <ProjectInfoTab
            projectInfo={projectInfo}
            setProjectInfo={setProjectInfo}
            ceContact={ceContact}
          />
        )}

        {tab === 1 && (
          <ScopeOfWorkTab
            sowItems={sowItems}
            updateSowItem={updateSowItem}
            addSowItem={addSowItem}
            removeSowItem={removeSowItem}
            pmOverrides={pmOverrides}
            setPmOverrides={setPmOverrides}
            calculations={calculations}
            expenses={expenses}
            setExpenses={setExpenses}
            subs={subs}
            setSubs={setSubs}
            projectInfo={projectInfo}
          />
        )}

        {tab === 2 && (
          <ResponsibilitiesTab
            customResponsibilities={customResponsibilities}
            setCustomResponsibilities={setCustomResponsibilities}
            customAssumptions={customAssumptions}
            setCustomAssumptions={setCustomAssumptions}
          />
        )}

        {tab === 3 && (
          <CostSummaryTab
            calculations={calculations}
            projectInfo={projectInfo}
          />
        )}

        {tab === 4 && (
          <GenerateTab
            projectInfo={projectInfo}
            ceContact={ceContact}
            calculations={calculations}
            sowItems={sowItems}
            generating={generating}
            onGenerate={handleGenerate}
          />
        )}
      </div>
    </div>
  );
}

// ─── Project Info Tab ───
function ProjectInfoTab({ projectInfo, setProjectInfo, ceContact }) {
  return (
    <div style={styles.twoColumnGrid}>
      <Card title="Project Details">
        <div style={styles.flexColumn}>
          <Field label="Created Date">
            <Input
              type="date"
              value={projectInfo.createdDate}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, createdDate: v }))
              }
            />
          </Field>
          <Field label="Customer Name">
            <Input
              value={projectInfo.customerName}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, customerName: v }))
              }
              placeholder="Enter customer name"
            />
          </Field>
          <Field label="Opportunity Name">
            <Input
              value={projectInfo.opportunityName}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, opportunityName: v }))
              }
              placeholder="e.g., 2026 – Network Refresh"
            />
          </Field>
          <Field label="Bill of Materials Reference">
            <Input
              value={projectInfo.billOfMaterialsRef}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, billOfMaterialsRef: v }))
              }
              placeholder="BOM reference number"
            />
          </Field>
        </div>
      </Card>

      <Card title="Team Assignment">
        <div style={styles.flexColumn}>
          <Field label="Client Executive">
            <Select
              value={projectInfo.clientExecutive}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, clientExecutive: v }))
              }
              options={["", ...CONTACTS.map((c) => c.name)]}
            />
          </Field>
          {ceContact && (
            <div style={styles.mutedText}>
              {ceContact.phone} &bull; {ceContact.email}
            </div>
          )}
          <Field label="Design Engineer">
            <Input
              value={projectInfo.designEngineer}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, designEngineer: v }))
              }
              placeholder="Engineer name"
            />
          </Field>
          <Field label="Implementation Engineer">
            <Input
              value={projectInfo.implementationEngineer}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, implementationEngineer: v }))
              }
              placeholder="Engineer name"
            />
          </Field>
          <Field label="Secondary Engineer">
            <Input
              value={projectInfo.secondaryEngineer}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, secondaryEngineer: v }))
              }
              placeholder="Engineer name (optional)"
            />
          </Field>
        </div>
      </Card>

      <Card title="Project Settings">
        <div style={styles.flexColumn}>
          <Field label="Work Location">
            <Select
              value={projectInfo.workLocation}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, workLocation: v }))
              }
              options={["Remote", "On-Site", "Hybrid"]}
            />
          </Field>
          <Field label="Risk Factor">
            <Select
              value={projectInfo.riskFactor}
              onChange={(v) => setProjectInfo((p) => ({ ...p, riskFactor: v }))}
              options={["Low", "Medium", "High"]}
            />
          </Field>
          <Field label="Discount Rate (%)">
            <Input
              type="number"
              value={projectInfo.discountRate}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, discountRate: v }))
              }
              min="0"
              max="100"
            />
          </Field>
          <Field label="Fair Market Uplift ($)">
            <Input
              type="number"
              value={projectInfo.fairMarketUplift}
              onChange={(v) =>
                setProjectInfo((p) => ({ ...p, fairMarketUplift: v }))
              }
            />
          </Field>
        </div>
      </Card>

      <div style={styles.fullWidthCard}>
        <Card title="Project Notes">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}>
            <Field label="Project Background">
              <textarea
                style={styles.textareaLarge}
                value={projectInfo.projectBackground}
                onChange={(e) =>
                  setProjectInfo((p) => ({
                    ...p,
                    projectBackground: e.target.value,
                  }))
                }
                placeholder="Describe the project background and context..."
                rows={6}
              />
            </Field>
            <Field label="Additional Notes">
              <textarea
                style={styles.textareaLarge}
                value={projectInfo.projectNotes}
                onChange={(e) =>
                  setProjectInfo((p) => ({
                    ...p,
                    projectNotes: e.target.value,
                  }))
                }
                placeholder="Any additional notes or special requirements..."
                rows={6}
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Scope of Work Tab ───
function ScopeOfWorkTab({
  sowItems,
  updateSowItem,
  addSowItem,
  removeSowItem,
  pmOverrides,
  setPmOverrides,
  calculations,
  expenses,
  setExpenses,
  subs,
  setSubs,
  customResponsibilities,
  setCustomResponsibilities,
  customAssumptions,
  setCustomAssumptions,
  projectInfo,
}) {
  return (
    <div style={styles.flexColumn}>
      {/* SOW Tasks */}
      <Card title="Scope of Work Tasks">
        <div style={styles.sowItemHeader}>
          <div style={styles.dimText}>Task Description</div>
          <div style={styles.dimText}>Work Role</div>
          <div style={styles.dimText}>Work Type</div>
          <div style={styles.dimText}>Hours</div>
          <div></div>
        </div>

        {sowItems.map((item, index) => (
          <div
            key={item.id}
            style={styles.sowItemRow}>
            <Input
              value={item.task}
              onChange={(v) => updateSowItem(item.id, "task", v)}
              placeholder={`Task ${index + 1}`}
            />
            <Select
              value={item.workRole}
              onChange={(v) => updateSowItem(item.id, "workRole", v)}
              options={WORK_ROLES.map((r) => r.role)}
            />
            <Select
              value={item.workType}
              onChange={(v) => updateSowItem(item.id, "workType", v)}
              options={WORK_TYPES}
            />
            <Input
              type="number"
              value={item.hours}
              onChange={(v) => updateSowItem(item.id, "hours", v)}
              min="0"
              step="0.25"
            />
            <button
              onClick={() => removeSowItem(item.id)}
              style={styles.deleteButton}
              title="Remove task">
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={addSowItem}
          style={styles.addButton}>
          + Add Task
        </button>

        <div style={{ ...styles.mutedText, marginTop: 12 }}>
          Total SOW Hours: {calculations.totalSowHours.toFixed(2)} &bull; Cost:{" "}
          {fmt(calculations.sowCost)} &bull; Sell: {fmt(calculations.sowSell)}
        </div>
      </Card>

      {/* PM & Eng Hours */}
      <div style={styles.twoColumnGrid}>
        <Card title="PM Hours (Auto-Calculated)">
          <div style={styles.hoursGrid}>
            <Field label="IKO">
              <div style={styles.mutedText}>
                {calculations.pmIko.toFixed(2)}
              </div>
            </Field>
            <Field label="EKO">
              <div style={styles.mutedText}>
                {calculations.pmEko.toFixed(2)}
              </div>
            </Field>
            <Field label="Coordination">
              <div style={styles.mutedText}>
                {calculations.pmCoord.toFixed(2)}
              </div>
            </Field>
            <Field label="Closeout">
              <div style={styles.mutedText}>
                {calculations.pmCloseout.toFixed(2)}
              </div>
            </Field>
            <Field label="3rd Party Coord">
              <Input
                type="number"
                value={pmOverrides.thirdPartyCoord}
                onChange={(v) =>
                  setPmOverrides((p) => ({ ...p, thirdPartyCoord: v }))
                }
                min="0"
                step="0.25"
              />
            </Field>
          </div>
          <div style={{ ...styles.mutedText, marginTop: 12 }}>
            Total PM Hours: {calculations.totalPmHours.toFixed(2)} &bull; Cost:{" "}
            {fmt(calculations.pmCost)} &bull; Sell: {fmt(calculations.pmSell)}
          </div>
        </Card>

        <Card title="Eng Overhead Hours">
          <div style={styles.hoursGrid}>
            <Field label="IKO">
              <div style={styles.mutedText}>
                {calculations.engIko.toFixed(2)}
              </div>
            </Field>
            <Field label="EKO">
              <div style={styles.mutedText}>
                {calculations.engEko.toFixed(2)}
              </div>
            </Field>
            <Field label="Coordination">
              <div style={styles.mutedText}>
                {calculations.engCoord.toFixed(2)}
              </div>
            </Field>
            <Field label="Closeout">
              <div style={styles.mutedText}>
                {calculations.engCloseout.toFixed(2)}
              </div>
            </Field>
            <Field label="Add'l Sync">
              <Input
                type="number"
                value={pmOverrides.additionalSync}
                onChange={(v) =>
                  setPmOverrides((p) => ({ ...p, additionalSync: v }))
                }
                min="0"
                step="0.25"
              />
            </Field>
            <Field label="Day 2 Standby">
              <Input
                type="number"
                value={pmOverrides.day2Standby}
                onChange={(v) =>
                  setPmOverrides((p) => ({ ...p, day2Standby: v }))
                }
                min="0"
                step="0.25"
              />
            </Field>
          </div>
          <div style={{ ...styles.mutedText, marginTop: 12 }}>
            Total Eng Hours: {calculations.totalEngHours.toFixed(2)} &bull;
            Cost: {fmt(calculations.engCost)} &bull; Sell:{" "}
            {fmt(calculations.engSell)}
          </div>
        </Card>
      </div>

      {/* Expenses */}
      <Card title="Travel & Expenses">
        <div style={{ ...styles.flexRowWrap, marginBottom: 12 }}>
          <Field
            label="Hotel (cost/night)"
            width="140px">
            <Input
              type="number"
              value={expenses.hotelCost}
              onChange={(v) => setExpenses((p) => ({ ...p, hotelCost: v }))}
            />
          </Field>
          <Field
            label="Nights"
            width="80px">
            <Input
              type="number"
              value={expenses.hotelQty}
              onChange={(v) => setExpenses((p) => ({ ...p, hotelQty: v }))}
            />
          </Field>
          <div style={styles.costDisplay}>
            Cost: {fmt(calculations.hotelCost)} &bull; Sell:{" "}
            {fmt(calculations.hotelSell)}
          </div>
        </div>

        <div style={{ ...styles.flexRowWrap, marginBottom: 12 }}>
          <Field
            label="Per Diem (cost/day)"
            width="140px">
            <Input
              type="number"
              value={expenses.perDiemCost}
              onChange={(v) => setExpenses((p) => ({ ...p, perDiemCost: v }))}
            />
          </Field>
          <Field
            label="Days"
            width="80px">
            <Input
              type="number"
              value={expenses.perDiemQty}
              onChange={(v) => setExpenses((p) => ({ ...p, perDiemQty: v }))}
            />
          </Field>
          <div style={styles.costDisplay}>
            Cost: {fmt(calculations.perDiemCost)} &bull; Sell:{" "}
            {fmt(calculations.perDiemSell)}
          </div>
        </div>

        <div style={{ ...styles.flexRowWrap, marginBottom: 12 }}>
          <Field
            label="Travel 1 Role"
            width="160px">
            <Select
              value={expenses.travel1Role}
              onChange={(v) => setExpenses((p) => ({ ...p, travel1Role: v }))}
              options={WORK_ROLES.map((r) => r.role)}
            />
          </Field>
          <Field
            label="Trips"
            width="80px">
            <Input
              type="number"
              value={expenses.travel1Qty}
              onChange={(v) => setExpenses((p) => ({ ...p, travel1Qty: v }))}
            />
          </Field>
          <div style={styles.costDisplay}>
            Cost: {fmt(calculations.travel1Cost)} &bull; Sell:{" "}
            {fmt(calculations.travel1Sell)}
          </div>
        </div>

        <div style={styles.flexRowWrap}>
          <Field
            label="Travel 2 Role"
            width="160px">
            <Select
              value={expenses.travel2Role}
              onChange={(v) => setExpenses((p) => ({ ...p, travel2Role: v }))}
              options={WORK_ROLES.map((r) => r.role)}
            />
          </Field>
          <Field
            label="Trips"
            width="80px">
            <Input
              type="number"
              value={expenses.travel2Qty}
              onChange={(v) => setExpenses((p) => ({ ...p, travel2Qty: v }))}
            />
          </Field>
          <div style={styles.costDisplay}>
            Cost: {fmt(calculations.travel2Cost)} &bull; Sell:{" "}
            {fmt(calculations.travel2Sell)}
          </div>
        </div>
      </Card>

      {/* Subcontractors */}
      <Card title="Subcontractors">
        {subs.map((sub, i) => (
          <div
            key={i}
            style={{ ...styles.flexRow, marginBottom: 8 }}>
            <Field label={i === 0 ? "Name" : undefined}>
              <Input
                value={sub.name}
                onChange={(v) =>
                  setSubs((prev) =>
                    prev.map((s, j) => (j === i ? { ...s, name: v } : s)),
                  )
                }
                placeholder="Subcontractor name"
              />
            </Field>
            <Field
              label={i === 0 ? "Cost" : undefined}
              width="140px">
              <Input
                type="number"
                value={sub.cost}
                onChange={(v) =>
                  setSubs((prev) =>
                    prev.map((s, j) => (j === i ? { ...s, cost: v } : s)),
                  )
                }
              />
            </Field>
          </div>
        ))}

        <button
          onClick={() => setSubs((prev) => [...prev, { name: "", cost: 0 }])}
          style={styles.addButton}>
          + Add Subcontractor
        </button>

        <div style={{ ...styles.mutedText, marginTop: 12 }}>
          Total Sub Cost: {fmt(calculations.subCostTotal)} &bull; Sell:{" "}
          {fmt(calculations.subSellTotal)}
        </div>
      </Card>
    </div>
  );
}

// ─── Cost Summary Tab ───
function CostSummaryTab({ calculations, projectInfo }) {
  return (
    <div style={styles.twoColumnGrid}>
      <Card title="Labor Summary">
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>PM Labor</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.pmCost)} / {fmt(calculations.pmSell)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>SOW Labor</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.sowCost)} / {fmt(calculations.sowSell)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Eng Overhead</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.engCost)} / {fmt(calculations.engSell)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>
            Risk Buffer ({projectInfo.riskFactor})
          </span>
          <span style={styles.summaryValue}>
            {fmt(calculations.riskAmount)}
          </span>
        </div>
        <div style={styles.summaryRowTotal}>
          <span style={styles.summaryLabel}>Labor Total</span>
          <span style={styles.summaryValueAccent}>
            {fmt(calculations.laborSellWithRisk)}
          </span>
        </div>
      </Card>

      <Card title="Expenses Summary">
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Hotel</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.hotelCost)} / {fmt(calculations.hotelSell)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Per Diem</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.perDiemCost)} / {fmt(calculations.perDiemSell)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Travel 1</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.travel1Cost)} / {fmt(calculations.travel1Sell)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Travel 2</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.travel2Cost)} / {fmt(calculations.travel2Sell)}
          </span>
        </div>
        <div style={styles.summaryRowTotal}>
          <span style={styles.summaryLabel}>Expenses Total</span>
          <span style={styles.summaryValueAccent}>
            {fmt(calculations.miscSellTotal)}
          </span>
        </div>
      </Card>

      <Card title="Subcontractors">
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Subcontractor Cost</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.subCostTotal)}
          </span>
        </div>
        <div style={styles.summaryRowTotal}>
          <span style={styles.summaryLabel}>Subcontractor Sell</span>
          <span style={styles.summaryValueAccent}>
            {fmt(calculations.subSellTotal)}
          </span>
        </div>
      </Card>

      <Card title="Project Totals">
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Labor (with risk)</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.laborSellWithRisk)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Expenses</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.miscSellTotal)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Subcontractors</span>
          <span style={styles.summaryValue}>
            {fmt(calculations.subSellTotal)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Fair Market Uplift</span>
          <span style={styles.summaryValue}>{fmt(calculations.fmu)}</span>
        </div>
        {calculations.discountAmount > 0 && (
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>
              Discount ({projectInfo.discountRate}%)
            </span>
            <span style={{ ...styles.summaryValue, color: colors.red }}>
              -{fmt(calculations.discountAmount)}
            </span>
          </div>
        )}
        <div style={styles.summaryRowTotal}>
          <span style={styles.summaryLabel}>Grand Total</span>
          <span style={styles.summaryValueAccent}>
            {fmt(calculations.grandTotal)}
          </span>
        </div>
        <div
          style={{
            ...styles.summaryRow,
            marginTop: 16,
            borderTop: `1px solid ${colors.border}`,
            paddingTop: 12,
          }}>
          <span style={styles.summaryLabel}>Total Cost</span>
          <span style={styles.summaryValue}>{fmt(calculations.totalCost)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Estimated Profit</span>
          <span style={{ ...styles.summaryValue, color: colors.green }}>
            {fmt(calculations.estProfit)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Profit Margin</span>
          <span style={{ ...styles.summaryValue, color: colors.green }}>
            {fmtPct(calculations.profitMargin)}
          </span>
        </div>
      </Card>

      <Card title="Hours Summary">
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>SOW Hours</span>
          <span style={styles.summaryValue}>
            {calculations.totalSowHours.toFixed(2)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>PM Hours</span>
          <span style={styles.summaryValue}>
            {calculations.totalPmHours.toFixed(2)}
          </span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Eng Overhead Hours</span>
          <span style={styles.summaryValue}>
            {calculations.totalEngHours.toFixed(2)}
          </span>
        </div>
        <div style={styles.summaryRowTotal}>
          <span style={styles.summaryLabel}>Total Hours</span>
          <span style={styles.summaryValueAccent}>
            {calculations.totalHours.toFixed(2)}
          </span>
        </div>
      </Card>
    </div>
  );
}

// ─── Generate Tab ───
function GenerateTab({
  projectInfo,
  ceContact,
  calculations,
  sowItems,
  generating,
  onGenerate,
}) {
  const activeSow = sowItems.filter((s) => s.task && s.hours > 0);
  const ready =
    projectInfo.customerName &&
    projectInfo.opportunityName &&
    activeSow.length > 0;

  // Pre-flight check items
  const preFlightItems = [
    ["Customer Name", !!projectInfo.customerName],
    ["Opportunity/Project Name", !!projectInfo.opportunityName],
    ["Client Executive", !!projectInfo.clientExecutive],
    ["Project Background", !!projectInfo.projectBackground],
    ["Scope of Work Items", activeSow.length > 0],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Pre-Flight Check */}
      <Card title="Pre-Flight Check">
        <div style={styles.preFlightContainer}>
          {preFlightItems.map(([label, ok], i) => (
            <div
              key={i}
              style={styles.preFlightRow}>
              <span style={styles.preFlightIcon(ok)}>{ok ? "✓" : "!"}</span>
              <span style={styles.preFlightLabel(ok)}>{label}</span>
              {!ok && <span style={styles.preFlightMissing}>(missing)</span>}
            </div>
          ))}
        </div>
      </Card>

      {/* Proposal Summary */}
      <Card title="Proposal Summary">
        <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.8 }}>
          <div>
            <strong style={{ color: colors.text }}>Customer:</strong>{" "}
            {projectInfo.customerName || "—"}
          </div>
          <div>
            <strong style={{ color: colors.text }}>Project:</strong>{" "}
            {projectInfo.opportunityName || "—"}
          </div>
          <div>
            <strong style={{ color: colors.text }}>Client Executive:</strong>{" "}
            {projectInfo.clientExecutive || "—"}{" "}
            {ceContact ? `(${ceContact.email})` : ""}
          </div>
          <div>
            <strong style={{ color: colors.text }}>Work Location:</strong>{" "}
            {projectInfo.workLocation}
          </div>
          <div>
            <strong style={{ color: colors.text }}>Total Hours:</strong>{" "}
            {calculations.totalHours?.toFixed(1) || "0.0"}
          </div>
          <div>
            <strong style={{ color: colors.text }}>
              Professional Services:
            </strong>{" "}
            {fmt(calculations.grandTotal)}
          </div>
          <div>
            <strong style={{ color: colors.text }}>SOW Items:</strong>{" "}
            {activeSow.length} tasks
          </div>
        </div>
      </Card>

      {/* Generate Button */}
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <button
          onClick={onGenerate}
          disabled={!ready || generating}
          style={{
            background: ready
              ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentHover})`
              : colors.border,
            color: ready ? colors.white : colors.textDim,
            border: "none",
            borderRadius: 10,
            padding: "16px 48px",
            fontSize: 16,
            fontWeight: 700,
            cursor: ready ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: ready ? `0 4px 24px ${colors.accent}44` : "none",
            letterSpacing: "0.02em",
          }}>
          {generating
            ? "Generating Proposal..."
            : "Generate Engagement Proposal"}
        </button>

        {!ready && (
          <div style={{ marginTop: 12, fontSize: 12, color: colors.textDim }}>
            Complete the required fields above to enable generation
          </div>
        )}

        <div style={{ marginTop: 12, fontSize: 11, color: colors.textDim }}>
          Downloads as Word document (.docx)
        </div>
      </div>
    </div>
  );
}
