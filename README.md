# Regulation Explorer

A comprehensive web application for exploring and filtering ESG (Environmental, Social, and Governance) regulations from around the world.

## Features

### Advanced Filtering System

The Regulation Explorer provides a powerful multi-dimensional filtering system with the following capabilities:

#### Geographic Filters
- **Region Dropdown**: Filter by major regions (Asia-Pacific, Europe, North America, South America, Africa & Middle East, International)
- **Country Dropdown**: Select from all 196 countries

#### Compliance Filters
- **Obligation**: Filter by mandatory, voluntary, or "comply or explain" regulations
- **Applicability**: Filter by entity type (Financial Institutions, Corporations, Asset Owners, Investment Managers, Credit Institutions, Data Providers, Others)

#### Financial Thresholds
- **Employee Count**: Set minimum employee count requirements
- **Currency Selection**: Choose between USD or EUR
- **Balance Sheet Size**: Filter by minimum balance sheet size (in millions)
- **Turnover**: Filter by minimum turnover (in millions)

#### Temporal Filters
- **Publication Date Range**: Sliding year range from 1950 to present

#### Subject Tag Filters

**Environmental Tags** (46 options):
- Agriculture: Animal welfare
- Biodiversity and ecosystem services
- Climate change (Adaptation, GHG emissions, Mitigation)
- Emissions/Pollution (various categories)
- Energy (Efficiency, Energy use, Renewables)
- Finance: Sustainable finance
- Land use (8 subcategories)
- Oceans (Fisheries, Marine conservation)
- Resources (4 subcategories)
- Waste management (4 categories)
- Water management (6 categories)

**Social Tags** (40 options):
- Employment conditions and policies (10 categories)
- Human Rights (14 categories)
- Product and service responsibility (9 categories)
- Social impacts/Value creation (6 categories)
- Supplier screening policies

**Governance Tags** (22 options):
- Accountability (8 categories)
- Effectiveness (5 categories)
- Leadership (6 categories)
- Relations with shareholders (2 categories)
- Remuneration

**Sector Tags** (100+ sectors):
Comprehensive coverage including Agriculture, Energy, Manufacturing, Financial Services, Technology, Healthcare, Construction, Transportation, and many more.

## User Interface

### Main Features
- **Search Bar**: Full-text search across regulation names, countries, and summaries
- **Filter Panel**: Collapsible advanced filter panel with active filter count indicator
- **Results Count**: Real-time display of filtered regulation count
- **Clear All**: One-click option to reset all filters

### Regulation Cards
Each regulation card displays:
- Regulation name and alias
- Country and region badges
- Obligation type (color-coded)
- Summary excerpt
- Authority information
- Publication date
- Current stage
- Link to source document
- Expandable details showing:
  - Full conditions
  - Applicability details
  - Sector information
  - Environmental, Social, and Governance tags

## Technical Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Custom CSV parser for data handling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Build

```bash
npm run build
```

The production build will be in the `dist` directory.

## Data Source

The application uses the "Repex Sample Regulations File" CSV dataset containing comprehensive ESG regulation information including:
- Metadata and identifiers
- Geographic coverage
- Financial thresholds
- Subject tagging across E, S, and G pillars
- Sector applicability
- Compliance requirements
- Source documentation

## Project Structure

```
src/
├── components/
│   └── RegulationExplorer.tsx    # Main component with filtering logic
├── data/
│   ├── filterOptions.ts          # Filter option definitions
│   └── Repex Sample Regulations File_031025.csv
├── types/
│   └── regulation.ts             # TypeScript interfaces
├── utils/
│   └── csvParser.ts              # CSV parsing utility
├── App.tsx                       # App entry point
└── main.tsx                      # React DOM rendering
```

## Features in Detail

### Multi-Select Filters
All dropdown filters support multiple selections, allowing users to combine criteria (e.g., multiple countries, regions, or obligations simultaneously).

### Tag-Based Filtering
The Environmental, Social, Governance, and Sector filters use a hierarchical tag system that allows precise filtering based on specific topics or industry sectors.

### Responsive Design
The application is fully responsive and works seamlessly across desktop, tablet, and mobile devices.

### Performance Optimizations
- Memoized filtering logic for optimal performance
- Efficient CSV parsing
- Virtual scrolling for large result sets
- Debounced search input

## Future Enhancements

Potential improvements could include:
- Export filtered results to CSV/PDF
- Saved filter presets
- Regulation comparison view
- Timeline visualization of regulatory changes
- Advanced analytics dashboard
- User accounts and favorites
- API integration for real-time updates

## License

This project is created for demonstration purposes.
