// src/components/ResponsibilitiesTab.jsx
import { Card, Field } from "./ui";
import { colors } from "../constants";
import { styles } from "../utils/styles";

export default function ResponsibilitiesTab({
  customResponsibilities,
  setCustomResponsibilities,
  customAssumptions,
  setCustomAssumptions,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Client Responsibilities */}
      <Card title="Client Responsibilities">
        <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16 }}>
          Define the responsibilities that the client must fulfill for
          successful project completion.
        </p>

        {customResponsibilities.map((item, i) => (
          <div
            key={i}
            style={styles.listItemRow}>
            <span style={styles.listItemNumber}>{i + 1}.</span>
            <textarea
              style={{ ...styles.textarea, minHeight: 40 }}
              value={item}
              onChange={(e) =>
                setCustomResponsibilities((prev) =>
                  prev.map((r, j) => (j === i ? e.target.value : r)),
                )
              }
              rows={2}
              placeholder="Enter client responsibility..."
            />
            <button
              onClick={() =>
                setCustomResponsibilities((prev) =>
                  prev.filter((_, j) => j !== i),
                )
              }
              style={styles.deleteButton}
              title="Remove">
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={() => setCustomResponsibilities((prev) => [...prev, ""])}
          style={styles.addButton}>
          + Add Responsibility
        </button>
      </Card>

      {/* Project Specific Assumptions */}
      <Card title="Project Specific Assumptions">
        <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16 }}>
          Define the assumptions that apply to this specific project engagement.
        </p>

        {customAssumptions.map((item, i) => (
          <div
            key={i}
            style={styles.listItemRow}>
            <span style={styles.listItemNumber}>{i + 1}.</span>
            <textarea
              style={{ ...styles.textarea, minHeight: 40 }}
              value={item}
              onChange={(e) =>
                setCustomAssumptions((prev) =>
                  prev.map((a, j) => (j === i ? e.target.value : a)),
                )
              }
              rows={2}
              placeholder="Enter project assumption..."
            />
            <button
              onClick={() =>
                setCustomAssumptions((prev) => prev.filter((_, j) => j !== i))
              }
              style={styles.deleteButton}
              title="Remove">
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={() => setCustomAssumptions((prev) => [...prev, ""])}
          style={styles.addButton}>
          + Add Assumption
        </button>
      </Card>
    </div>
  );
}
