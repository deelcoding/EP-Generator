// ─── Rate Tables & Constants ───

export const WORK_ROLES = [
  {
    role: "Engineer IV",
    weightedCost: 156,
    baseRate: 240,
    travelCost: 87.5,
    travelRate: 125,
  },
  {
    role: "Engineer III",
    weightedCost: 156,
    baseRate: 225,
    travelCost: 87.5,
    travelRate: 125,
  },
  {
    role: "Engineer II",
    weightedCost: 105,
    baseRate: 170,
    travelCost: 87.5,
    travelRate: 125,
  },
  {
    role: "Engineer I",
    weightedCost: 80,
    baseRate: 130,
    travelCost: 87.5,
    travelRate: 125,
  },
  {
    role: "Technician II",
    weightedCost: 80,
    baseRate: 115,
    travelCost: 80,
    travelRate: 115,
  },
  {
    role: "Technician I",
    weightedCost: 55,
    baseRate: 100,
    travelCost: 55,
    travelRate: 100,
  },
  {
    role: "Project Management",
    weightedCost: 70,
    baseRate: 100,
    travelCost: 70,
    travelRate: 100,
  },
];

export const WORK_TYPES = ["Proj. Normal", "Proj. Overtime", "Design Eng (ER)"];

export const CONTACTS = [
  {
    name: "Aaron Williams",
  },
  {
    name: "Collier Phelps",
  },
  {
    name: "David Crawford",
  },
  {
    name: "Duncan McKinney",
  },
  {
    name: "Jared Ferguson",
  },
  {
    name: "Kristen Tayler",
  },
  {
    name: "Cody Beadles",
  },
  {
    name: "Maggie McGovern",
  },
  {
    name: "Mariah Obermeier",
  },
  {
    name: "Mark Anselment",
  },
  {
    name: "Matt Buechler",
  },
  {
    name: "Pete Mikiten",
  },
  {
    name: "Rob Wildman",
  },
];

export const CLIENT_RESPONSIBILITIES = [
  "Client will be available for consultation before, during and after the installation",
  "Client will provide timely access to necessary systems, facilities, and personnel",
  "Client will provide accurate and complete information required for planning and execution",
  "Client will maintain current backups of all critical systems prior to implementation",
  "Client will assist coordination of third-party vendors when integration or dependencies exist",
  "Client will communicate any changes in business requirements or priorities promptly",
];

export const PROJECT_ASSUMPTIONS = [
  "Customer has access to & possession of all licensing needed to complete this project",
  "Customer has all login credentials needed for the success of this project",
  "All work will be performed during standard business hours; unless otherwise specified",
  "Matrix is not responsible for pre-existing issues or conditions; unless otherwise specified",
  "Network design(s) assume existing cabling and infrastructure meet minimum standards; unless otherwise specified",
  "Datacenter work assumes adequate rack space, power, and cooling are available; unless otherwise specified",
  "Remote work will be utilized where feasible to optimize project efficiency; unless otherwise specified",
];

export const DEFAULT_ASSUMPTIONS = [
  "Client to provide timely access to internal experts for critical information.",
  "Client is responsible for providing Matrix with login credentials for any equipment that may need to be monitored, re-configured, or evaluated during the project.",
  "Client to provide the required space for new equipment: either in a rack, platform, table or shelf.",
  "It is the responsibility of the client to make any necessary modifications to existing servers or network systems not explicitly mentioned in this engagement proposal.",
  "Timely completion of your project is very important to us. Upon assignment of a Project Manager, we may request Username/Passwords, contact information for the project, and any additional information as required to complete the stated goals of this engagement.",
  "Client to provide adequate workspace and environment for implementation, including access to working environment.",
  "Matrix Integration assumes that the client is providing sufficient AC Power and proper receptacles in each of the wiring closets/server locations.",
  "Unless specified within this engagement, Matrix Integration assumes that the client is providing vendor approved UPS equipment.",
  "Client to be responsible for a baseline systems level backup of all impacted data services prior to implementation by Matrix Integration.",
  "Password Protection is vital to the secure implementation of any project. It is the client's responsibility to keep an active, secure password metric in place.",
  "Unless otherwise identified within this proposal, the Client will be responsible for the disposal of all packaging materials and abatement of any relevant equipment.",
  "Matrix may require that the customer complete a network worksheet to provide information vital to the successful completion of the project.",
  "Matrix assumes that the customer will coordinate with third parties to provide ancillary services and that the customer will address related problems directly with the third parties.",
  "Client will adhere to Matrix Integration, LLC Terms & Conditions. See Attached Terms & Conditions.",
];

export const TABS = [
  "Project Info",
  "Scope of Work",
  "Responsibilities & Assumptions",
  "Cost Summary",
  "Generate Proposal",
];

export const colors = {
  // Neutrals
  alabaster: "#F2F2ED",
  sky: "#EFF5FA",
  ebony: "#506457",
  jet: "#373737",

  // Accents
  matrixBlue: "#2570B9",
  bone: "#D7D8C6",
  cambridge: "#B5D4B9",

  // Mapped colors for the app
  bg: "#F2F2ED",
  card: "#FFFFFF",
  cardAlt: "#EFF5FA",
  border: "#D7D8C6",

  accent: "#2570B9",
  accentHover: "#1e5a94",
  accentGlow: "rgba(37, 112, 185, 0.15)",

  // Updated green for better visibility on dark backgrounds
  green: "#22c55e", // Brighter green for the header stats
  greenGlow: "rgba(34, 197, 94, 0.15)",

  red: "#c44536",
  orange: "#d4a054",

  text: "#373737",
  textMuted: "#506457",
  textDim: "#7a8a7e",
  white: "#FFFFFF",

  inputBg: "#FFFFFF",
  inputBorder: "#D7D8C6",
  inputFocus: "#2570B9",

  success: "#B5D4B9",
  successGlow: "rgba(181, 212, 185, 0.3)",

  // Keep cambridge for other success states in light areas
  cambridgeGreen: "#B5D4B9",
};
