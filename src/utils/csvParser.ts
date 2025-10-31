import { Regulation } from '../types/regulation';

export function parseCSV(csvText: string): Regulation[] {
  const rows = parseCSVRows(csvText);
  const dataStartIndex = 4;
  const regulations: Regulation[] = [];

  for (let i = dataStartIndex; i < rows.length; i++) {
    const values = rows[i];
    // CSV has an empty first column, so actual data starts at index 1
    // Check if this is a valid regulation row (starts with reg/)
    if (values.length < 3 || !values[1] || !values[1].startsWith('reg/')) continue;

    regulations.push({
      metaId: values[1] || '',
      countryCode: values[2] || '',
      name: values[3] || '',
      regulationAlias: values[4] || '',
      authority: values[5] || '',
      sourceUrl: values[6] || '',
      region: values[7] || '',
      country: values[8] || '',
      summary: values[9] || '',
      conditions: values[10] || '',
      employeeCount: values[11] || '',
      currency: values[12] || '',
      turnover: values[13] || '',
      balanceSheetCurrency: values[14] || '',
      balanceSheet: values[15] || '',
      publicPrivate: values[16] || '',
      penalties: values[17] || '',
      aum: values[18] || '',
      nonEuApplies: values[19] || '',
      obligation: values[20] || '',
      subjectTagging: values[21] || '',
      environmental: values[22] || '',
      social: values[23] || '',
      governance: values[24] || '',
      publicationDate: values[25] || '',
      entryIntoForce: values[26] || '',
      currentStage: values[27] || '',
      applicabilityDate: values[28] || '',
      firstReportingExpected: values[29] || '',
      parentRegulation: values[30] || '',
      relationshipType: values[31] || '',
      applicability: values[32] || '',
      sector: values[33] || '',
      relatedRegulations: values[34] || '',
      lastUpdated: values[35] || '',
    });
  }

  return regulations;
}

function parseCSVRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else if (char === '\r' && !inQuotes) {
      // Skip carriage returns
      continue;
    } else {
      currentField += char;
    }
  }

  // Add the last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}
