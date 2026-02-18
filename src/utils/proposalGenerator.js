/**
 * Template-Based DOCX Proposal Generator
 * Uses the actual Matrix Integration template and replaces placeholders
 *
 * Template placeholders (using [brackets]):
 * - [Proposal #] - Opportunity/proposal number
 * - [Proposal Title] - Full proposal name (used in combination with above)
 * - [Customer Name] - Client company name
 * - [Created] - Created/proposal date
 * - [Expiration] - Expiration date
 * - [Client Executive] - CE name
 * - [CE Phone] - CE phone number
 * - [CE Email] - CE email address
 */

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { fmtDate } from "./helpers";

// Import the template file as a URL using Vite's asset handling
import templateUrl from "../assets/Engagement_Proposal_2025_Standard.docx?url";

/**
 * Load the template file
 */
async function loadTemplate() {
  try {
    console.log("Fetching template from:", templateUrl);

    const response = await fetch(templateUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to load template: ${response.status} ${response.statusText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log("Loaded template, size:", arrayBuffer.byteLength, "bytes");

    // Check for ZIP signature (PK\x03\x04)
    const view = new Uint8Array(arrayBuffer);
    if (view[0] !== 0x50 || view[1] !== 0x4b) {
      console.error(
        "Invalid file header. First bytes:",
        view[0],
        view[1],
        view[2],
        view[3],
      );
      throw new Error("File does not appear to be a valid DOCX/ZIP file");
    }

    return arrayBuffer;
  } catch (error) {
    console.error("Error loading template:", error);
    throw error;
  }
}

/**
 * Custom parser to handle bracket delimiters and spaces in placeholder names
 */
function angularParser(tag) {
  return {
    get: function (scope) {
      // Normalize the tag (trim whitespace)
      const normalizedTag = tag.trim();
      if (normalizedTag in scope) {
        return scope[normalizedTag];
      }
      // Also try the original tag
      if (tag in scope) {
        return scope[tag];
      }
      return "";
    },
  };
}

/**
 * Generate a proposal document from the template
 */
export async function generateProposalDocx({
  projectInfo,
  ceContact,
  calculations,
  sowItems,
  customResponsibilities,
  customAssumptions,
  aiContent,
  expDate,
  getRateForType,
}) {
  // Load the template
  const templateBuffer = await loadTemplate();

  // Create a zip instance from the template
  const zip = new PizZip(templateBuffer);

  // Create docxtemplater instance with custom delimiters for [brackets]
  const doc = new Docxtemplater(zip, {
    delimiters: { start: "[", end: "]" },
    paragraphLoop: true,
    linebreaks: true,
    parser: angularParser,
    nullGetter: function () {
      return "";
    },
  });

  // Prepare the data for replacement
  const ceName = projectInfo.clientExecutive || "";
  const ceEmail = ceContact?.email || "";
  const cePhone = ceContact?.phone || "";

  // Split on either hyphen or en dash using regex
  const oppParts = (projectInfo.opportunityName || "").split(/ [-–] /);
  const proposalNum = oppParts[0] || projectInfo.opportunityName || "";
  const proposalTitle =
    oppParts.length > 1 ? oppParts.slice(1).join(" - ") : "";

  // Format Client Responsibilities as bullet points
  const formattedResponsibilities = (customResponsibilities || [])
    .map((item) => `• ${item}`)
    .join("\n");

  // Format Project Specific Assumptions as bullet points
  const formattedAssumptions = (customAssumptions || [])
    .map((item) => `• ${item}`)
    .join("\n");

  // Format SOW items as a bulleted list
  const formattedSOW = sowItems
    .filter((item) => item.task && item.hours > 0)
    .map((item) => `• ${item.task} (${item.hours}h - ${item.workRole})`)
    .join("\n");

  // Set the template data - keys must match placeholder names exactly
  // Include variations to handle potential whitespace issues
  const data = {
    "Proposal #": proposalNum,
    "Proposal Title": proposalTitle,
    "Customer Name": projectInfo.customerName || "",
    Created: fmtDate(projectInfo.createdDate),
    Expiration: fmtDate(expDate),
    "Client Executive": ceName,
    "CE Phone": cePhone,
    "CE Email": ceEmail,
    "Client Responsibilities": formattedResponsibilities,
    "Project Specific Assumptions": formattedAssumptions,
    "Total Cost": calculations.grandTotal
      ? `${calculations.grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "$0.00",
    BOM: projectInfo.billOfMaterialsRef || "",
    SOW: formattedSOW,
  };

  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    console.error("Template rendering error:", error);
    // Log more details about the error
    if (error.properties && error.properties.errors) {
      error.properties.errors.forEach((err) => {
        console.error("Docx error:", err);
      });
    }
    throw new Error("Failed to render document template: " + error.message);
  }

  // Generate the output as a blob
  const output = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  return output;
}

/**
 * Download the generated document
 */
export function downloadDocx(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
