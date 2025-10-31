export interface Regulation {
  metaId: string;
  countryCode: string;
  name: string;
  regulationAlias: string;
  authority: string;
  sourceUrl: string;
  region: string;
  country: string;
  summary: string;
  conditions: string;
  employeeCount: string;
  currency: string;
  turnover: string;
  balanceSheetCurrency: string;
  balanceSheet: string;
  publicPrivate: string;
  penalties: string;
  aum: string;
  nonEuApplies: string;
  obligation: string;
  subjectTagging: string;
  environmental: string;
  social: string;
  governance: string;
  publicationDate: string;
  entryIntoForce: string;
  currentStage: string;
  applicabilityDate: string;
  firstReportingExpected: string;
  parentRegulation: string;
  relationshipType: string;
  applicability: string;
  sector: string;
  relatedRegulations: string;
  lastUpdated: string;
}

export interface FilterOptions {
  regions: string[];
  countries: string[];
  obligations: string[];
  currencies: string[];
  applicabilities: string[];
  publicationYearRange: [number, number];
  environmentalTags: string[];
  socialTags: string[];
  governanceTags: string[];
  sectorTags: string[];
}
