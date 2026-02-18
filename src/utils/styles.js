// src/utils/styles.js
import { colors } from "../constants";

export const styles = {
  // ─── App Container ───
  appContainer: {
    minHeight: "100vh",
    background: colors.bg,
    color: colors.text,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // ─── Header ───
  header: {
    background: `linear-gradient(135deg, ${colors.jet} 0%, ${colors.ebony} 100%)`,
    borderBottom: `1px solid ${colors.border}`,
    padding: "16px 24px",
  },

  headerContent: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.white,
    margin: 0,
    letterSpacing: "-0.02em",
  },

  headerAccent: {
    color: colors.cambridge,
  },

  headerSubtitle: {
    fontSize: 12,
    color: colors.bone,
    margin: "4px 0 0",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },

  // ─── Stats Boxes ───
  statsContainer: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },

  statBox: (bgColor, borderColor) => ({
    background: bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 8,
    padding: "8px 14px",
    textAlign: "center",
  }),

  statLabel: {
    fontSize: 11,
    color: colors.bone,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  statValue: (color) => ({
    fontSize: 20,
    fontWeight: 700,
    color: color,
    fontVariantNumeric: "tabular-nums",
  }),

  // ─── Tab Bar ───
  tabBar: {
    background: colors.white,
    borderBottom: `2px solid ${colors.matrixBlue}`,
    position: "sticky",
    top: 0,
    zIndex: 50,
  },

  tabContainer: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    gap: 0,
    padding: "0 24px",
  },

  tab: (isActive) => ({
    padding: "14px 20px",
    fontSize: 13,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? colors.matrixBlue : colors.textMuted,
    background: isActive ? colors.sky : "none",
    border: "none",
    borderBottom: isActive ? `3px solid ${colors.matrixBlue}` : "3px solid transparent",
    cursor: "pointer",
    transition: "all 0.15s",
    letterSpacing: "0.01em",
  }),

  // ─── Main Content ───
  mainContent: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px",
  },

  // ─── Flex Layouts ───
  flexRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  flexRowWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "end",
  },

  flexColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  // ─── Project Info Grid ───
  projectInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },

  fullWidthCard: {
    gridColumn: "1 / -1",
  },

  // ─── SOW Grid ───
  sowItemRow: {
    display: "grid",
    gridTemplateColumns: "1fr 140px 140px 80px 32px",
    gap: 8,
    alignItems: "end",
    marginBottom: 8,
  },

  sowItemHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 140px 140px 80px 32px",
    gap: 8,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: `1px solid ${colors.border}`,
  },

  // ─── Hours Grid ───
  hoursGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 8,
  },

  // ─── Text Styles ───
  costDisplay: {
    fontSize: 12,
    color: colors.textMuted,
    padding: "10px 0",
  },

  mutedText: {
    fontSize: 12,
    color: colors.textMuted,
  },

  dimText: {
    fontSize: 12,
    color: colors.textDim,
  },

  // ─── List Items ───
  listItemRow: {
    display: "flex",
    gap: 8,
    marginBottom: 6,
    alignItems: "start",
  },

  listItemNumber: {
    color: colors.textDim,
    fontSize: 12,
    paddingTop: 8,
    minWidth: 20,
  },

  // ─── Buttons ───
  addButton: {
    marginTop: 8,
    background: colors.accentGlow,
    border: `1px solid ${colors.matrixBlue}`,
    borderRadius: 6,
    padding: "6px 14px",
    color: colors.matrixBlue,
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
  },

  deleteButton: {
    background: "none",
    border: "none",
    color: colors.red,
    cursor: "pointer",
    fontSize: 16,
    opacity: 0.7,
    padding: "4px 8px",
  },

  generateButton: (disabled) => ({
    background: disabled ? colors.bone : `linear-gradient(135deg, ${colors.matrixBlue}, ${colors.accentHover})`,
    color: disabled ? colors.textDim : colors.white,
    border: "none",
    borderRadius: 8,
    padding: "16px 32px",
    fontSize: 15,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    boxShadow: disabled ? "none" : `0 4px 24px ${colors.accentGlow}`,
    opacity: disabled ? 0.6 : 1,
  }),

  // ─── Grid Layouts ───
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 16,
  },

  // ─── Summary Rows ───
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: `1px solid ${colors.border}`,
  },

  summaryRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderTop: `2px solid ${colors.matrixBlue}`,
    marginTop: 8,
    fontWeight: 600,
  },

  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },

  summaryValue: {
    color: colors.text,
    fontSize: 13,
    fontVariantNumeric: "tabular-nums",
  },

  summaryValueAccent: {
    color: colors.matrixBlue,
    fontSize: 15,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
  },

  // ─── Textarea ───
  textarea: {
    flex: 1,
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: 6,
    padding: "8px 10px",
    color: colors.text,
    fontSize: 12,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    minHeight: 60,
  },

  textareaLarge: {
    flex: 1,
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: 6,
    padding: "12px",
    color: colors.text,
    fontSize: 13,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    minHeight: 120,
    lineHeight: 1.5,
  },

  // ─── Generate Tab ───
  generateTabContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  generateButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "24px",
    background: colors.card,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
  },

  generateHelpText: {
    marginTop: 12,
    fontSize: 12,
    color: colors.textDim,
  },

  generateAiNote: {
    marginTop: 12,
    fontSize: 11,
    color: colors.textDim,
  },

  // ─── Pre-Flight Check ───
  preFlightContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  preFlightRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
  },

  preFlightIcon: (ok) => ({
    width: 22,
    height: 22,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    background: ok ? colors.successGlow : `${colors.red}15`,
    color: ok ? colors.ebony : colors.red,
    border: `1px solid ${ok ? colors.cambridge : colors.red}`,
  }),

  preFlightLabel: (ok) => ({
    color: ok ? colors.text : colors.textMuted,
  }),

  preFlightMissing: {
    fontSize: 11,
    color: colors.textDim,
  },

  // ─── Preview Section ───
  previewSection: {
    background: colors.card,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    padding: 20,
  },

  previewTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.text,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: `1px solid ${colors.border}`,
  },

  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  },

  previewItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  previewLabel: {
    fontSize: 11,
    color: colors.textDim,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  previewValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: 500,
  },

  previewValueAccent: {
    fontSize: 18,
    color: colors.matrixBlue,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
  },

  // ─── SOW Preview List ───
  sowPreviewList: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: `1px solid ${colors.border}`,
  },

  sowPreviewItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: `1px solid ${colors.border}`,
    fontSize: 13,
  },

  sowPreviewTask: {
    color: colors.text,
  },

  sowPreviewHours: {
    color: colors.textMuted,
    fontVariantNumeric: "tabular-nums",
  },

  // ─── Error/Success Messages ───
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: 8,
  },

  successText: {
    color: colors.ebony,
    fontSize: 12,
    marginTop: 8,
  },
};

export default styles;