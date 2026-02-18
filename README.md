# Matrix Labor Quote Estimator

A professional engagement proposal generator for Matrix Integration. This application helps sales engineers create professional Word document proposals by filling in the company template.

## Features

- **Template-Based Generation**: Uses the actual Matrix Integration Word template
- **Project Info Management**: Track customer details, engineers, and pricing configuration
- **Scope of Work Builder**: Define tasks with work roles, types, and hours
- **Auto-Calculated PM Hours**: IKO, EKO, coordination, and closeout hours auto-calculated
- **Cost Summary**: Real-time labor cost and profit calculations
- **DOCX Generation**: Creates professional Word documents from the company template
- **AI-Enhanced Content**: Uses Claude API to enhance project background sections

## Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx                    # Main application component with all tabs
    ├── main.jsx                   # React entry point
    ├── assets/
    │   └── Engagement_Proposal_2025_Standard.docx  # Company template
    ├── components/
    │   └── ui.jsx                 # Shared UI components (Card, Field, Input, Select)
    ├── constants/
    │   └── index.js               # Rate tables, contacts, default text
    └── utils/
        ├── helpers.js             # Utility functions (formatting, rate calculations)
        └── proposalGenerator.js   # Template-based DOCX generator
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Project Info Tab**: Enter customer name, project details, and select client executive
2. **Scope of Work Tab**: Add task lines with hours and roles, customize responsibilities and assumptions
3. **Cost Summary Tab**: Review labor costs, margins, and pricing
4. **Generate Tab**: Click "Generate Engagement Proposal" to download the .docx file

## Template Placeholders

The generator replaces these placeholders in the template:

| Placeholder | Description | Source |
|-------------|-------------|--------|
| `[Proposal #]` | Proposal/opportunity number | First part of Opportunity Name |
| `[Proposal Title]` | Project title | After " – " in Opportunity Name |
| `[Customer Name]` | Client company name | Customer Name field |
| `[Created]` | Created date | Created Date field |
| `[Expiration]` | Expiration date | Auto-calculated (Created + 30 days) |
| `[Client Executive]` | CE name | Client Executive dropdown |
| `[CE Phone]` | CE phone number | Auto-filled from contacts |
| `[CE Email]` | CE email address | Auto-filled from contacts |

### Adding More Placeholders

To add more dynamic content to the template:

1. Open the template (`src/assets/Engagement_Proposal_2025_Standard.docx`) in Microsoft Word
2. Add placeholders using the format `[Placeholder Name]`
3. Update `src/utils/proposalGenerator.js` to include the new placeholder in the `setData()` call
4. Restart the dev server after modifying the template file

## Technologies

- React 18
- Vite
- docxtemplater (template-based Word document generation)
- PizZip (ZIP file handling)
- Anthropic Claude API (optional, for content enhancement)

## License

Proprietary - Matrix Integration, LLC
