import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ExternalLink, ArrowRight, Tag, Building2 } from 'lucide-react';
import { Regulation } from '../types/regulation';
import { parseCSV } from '../utils/csvParser';
import { ENVIRONMENTAL_TAGS, SOCIAL_TAGS, GOVERNANCE_TAGS, SECTOR_TAGS } from '../data/filterOptions';
import { AUTHORITIES } from '../data/authorities';
import RegulationDetail from './RegulationDetail';

const REGIONS = ['Asia Pacific', 'Europe', 'North America', 'South America', 'Africa & Middle East', 'International'];
const OBLIGATIONS = ['Mandatory', 'Voluntary', 'Comply or Explain'];
const CURRENCIES = ['USD', 'EUR'];
const APPLICABILITIES = ['Financial Institutions', 'Credit Institutions', 'Asset Owners', 'Investment Managers', 'Data Providers', 'Others'];

export default function RegulationExplorer() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null);

  const [selectedObligations, setSelectedObligations] = useState<string[]>([]);
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);
  const [selectedApplicabilities, setSelectedApplicabilities] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [employeeCount, setEmployeeCount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [turnover, setTurnover] = useState('');
  const [balanceSheet, setBalanceSheet] = useState('');
  const [extraJurisdictional, setExtraJurisdictional] = useState<string>('');
  const [yearRange, setYearRange] = useState<[number, number]>([1950, new Date().getFullYear()]);
  const [selectedEnvTags, setSelectedEnvTags] = useState<string[]>([]);
  const [selectedSocialTags, setSelectedSocialTags] = useState<string[]>([]);
  const [selectedGovTags, setSelectedGovTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    fetch('/regulations.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = parseCSV(text);
        setRegulations(parsed);
      })
      .catch(error => console.error('Error loading regulations:', error));
  }, []);


  const filteredRegulations = useMemo(() => {
    return regulations.filter(reg => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const searchableFields = [
          reg.metaId, reg.name, reg.regulationAlias, reg.authority, reg.country,
          reg.region, reg.summary, reg.conditions, reg.obligation, reg.applicability,
          reg.environmental, reg.social, reg.governance, reg.sector, reg.penalties
        ].join(' ').toLowerCase();

        if (!searchableFields.includes(search)) {
          return false;
        }
      }

      if (selectedObligations.length > 0 && !selectedObligations.includes(reg.obligation)) return false;
      if (selectedAuthorities.length > 0 && !selectedAuthorities.includes(reg.authority)) return false;
      if (selectedRegions.length > 0 && !selectedRegions.includes(reg.region)) return false;
      if (selectedCountries.length > 0 && !selectedCountries.includes(reg.country)) return false;

      if (selectedApplicabilities.length > 0) {
        const hasMatch = selectedApplicabilities.some(app =>
          reg.applicability.includes(app)
        );
        if (!hasMatch) return false;
      }

      if (employeeCount) {
        if (!reg.employeeCount) return true;
        const empCount = parseInt(reg.employeeCount.replace(/,/g, ''));
        const filterCount = parseInt(employeeCount);
        if (!isNaN(empCount) && !isNaN(filterCount) && filterCount < empCount) return false;
      }

      if (turnover) {
        if (!reg.turnover) return true;
        const turnoverVal = parseFloat(reg.turnover.replace(/,/g, ''));
        const filterTurnover = parseFloat(turnover);
        if (!isNaN(turnoverVal) && !isNaN(filterTurnover) && filterTurnover < turnoverVal) return false;
      }

      if (balanceSheet) {
        if (!reg.balanceSheet) return true;
        const bsVal = parseFloat(reg.balanceSheet.replace(/,/g, ''));
        const filterBS = parseFloat(balanceSheet);
        if (!isNaN(bsVal) && !isNaN(filterBS) && filterBS < bsVal) return false;
      }

      if (extraJurisdictional && reg.nonEuApplies) {
        if (extraJurisdictional === 'Yes' && !reg.nonEuApplies.toLowerCase().includes('yes')) return false;
        if (extraJurisdictional === 'No' && !reg.nonEuApplies.toLowerCase().includes('no')) return false;
      }

      if (reg.publicationDate) {
        const year = parseInt(reg.publicationDate.split('/')[2] || reg.publicationDate.split('-')[0]);
        if (year && (year < yearRange[0] || year > yearRange[1])) return false;
      }

      if (selectedEnvTags.length > 0) {
        const hasMatch = selectedEnvTags.some(tag => reg.environmental.includes(tag));
        if (!hasMatch) return false;
      }

      if (selectedSocialTags.length > 0) {
        const hasMatch = selectedSocialTags.some(tag => reg.social.includes(tag));
        if (!hasMatch) return false;
      }

      if (selectedGovTags.length > 0) {
        const hasMatch = selectedGovTags.some(tag => reg.governance.includes(tag));
        if (!hasMatch) return false;
      }

      if (selectedSectors.length > 0) {
        const hasMatch = selectedSectors.some(sector => reg.sector.includes(sector));
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [regulations, searchTerm, selectedObligations, selectedAuthorities, selectedRegions, selectedCountries,
      selectedApplicabilities, employeeCount, turnover, balanceSheet,
      extraJurisdictional, yearRange, selectedEnvTags, selectedSocialTags, selectedGovTags,
      selectedSectors]);

  const clearAllFilters = () => {
    setSelectedObligations([]);
    setSelectedAuthorities([]);
    setSelectedApplicabilities([]);
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedSectors([]);
    setEmployeeCount('');
    setSelectedCurrency('');
    setTurnover('');
    setBalanceSheet('');
    setExtraJurisdictional('');
    setYearRange([1950, new Date().getFullYear()]);
    setSelectedEnvTags([]);
    setSelectedSocialTags([]);
    setSelectedGovTags([]);
    setSearchTerm('');
  };

  const activeFilterCount = [
    selectedObligations.length, selectedAuthorities.length, selectedApplicabilities.length,
    selectedRegions.length, selectedCountries.length, selectedSectors.length, selectedCurrency ? 1 : 0,
    employeeCount ? 1 : 0, turnover ? 1 : 0, balanceSheet ? 1 : 0,
    extraJurisdictional ? 1 : 0,
    selectedEnvTags.length, selectedSocialTags.length, selectedGovTags.length
  ].reduce((a, b) => a + b, 0);

  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    regulations.forEach(reg => {
      if (reg.country) countrySet.add(reg.country);
    });
    return Array.from(countrySet).sort();
  }, [regulations]);

  const totalPages = Math.ceil(filteredRegulations.length / ITEMS_PER_PAGE);
  const paginatedRegulations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredRegulations.slice(startIndex, endIndex);
  }, [filteredRegulations, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedObligations, selectedAuthorities, selectedApplicabilities,
      selectedRegions, selectedCountries, selectedSectors, employeeCount, turnover,
      balanceSheet, extraJurisdictional, yearRange, selectedEnvTags, selectedSocialTags, selectedGovTags]);

  if (selectedRegulation) {
    return <RegulationDetail regulation={selectedRegulation} regulations={regulations} onBack={() => setSelectedRegulation(null)} onSelectRegulation={setSelectedRegulation} />;
  }

  return (
    <div className="min-h-screen bg-esg-teal-light">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/ESG-Book-Resized.png" alt="ESG Book" className="h-12" />
              <div>
                <h1 className="text-2xl font-bold text-esg-black">ESG Book Reporting Exchange</h1>
                <p className="text-sm text-gray-600">Global ESG Regulations Database</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-esg-black transition-colors">
              <span>Export Results</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-esg-black mb-4">
            Explore <span className="text-esg-teal">3,000+</span> ESG Regulations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            Filter by applicability, geography, and organization profile to find regulations that apply to you across 80+ jurisdictions.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-esg-teal mb-2">3,000+</div>
              <div className="text-sm text-gray-600 font-medium">Total Regulations</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-esg-teal mb-2">80+</div>
              <div className="text-sm text-gray-600 font-medium">Jurisdictions</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-esg-teal mb-2">115+</div>
              <div className="text-sm text-gray-600 font-medium">ESG Subjects</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-esg-teal mb-2">95+</div>
              <div className="text-sm text-gray-600 font-medium">Sectors</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Search regulations by title, description, jurisdiction, or ESG subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-esg-teal focus:border-transparent bg-white shadow-sm text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-8 py-5 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-esg-teal" />
                <h2 className="text-base font-medium text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="px-2.5 py-0.5 bg-esg-teal text-esg-black rounded-full text-xs font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-esg-black flex items-center gap-1.5 transition-colors"
                >
                  <X size={15} /> Clear all
                </button>
              )}
            </div>

            <div className="px-8 py-7">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FilterSelect
                label="Obligation"
                options={OBLIGATIONS}
                selected={selectedObligations}
                onChange={setSelectedObligations}
              />

              <FilterSelect
                label="Authority"
                options={AUTHORITIES}
                selected={selectedAuthorities}
                onChange={setSelectedAuthorities}
              />

              <FilterSelect
                label="Applicability"
                options={APPLICABILITIES}
                selected={selectedApplicabilities}
                onChange={setSelectedApplicabilities}
              />

              <FilterSelect
                label="Region"
                options={REGIONS}
                selected={selectedRegions}
                onChange={setSelectedRegions}
              />

              <FilterSelect
                label="Country"
                options={countries}
                selected={selectedCountries}
                onChange={setSelectedCountries}
              />

              <FilterSelect
                label="Sector"
                options={SECTOR_TAGS}
                selected={selectedSectors}
                onChange={setSelectedSectors}
              />

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                  Employee Count
                </label>
                <input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="e.g., 250"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-esg-teal hover:border-gray-300 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                  Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-esg-teal hover:border-gray-300 transition-colors text-sm"
                >
                  <option value="">Select...</option>
                  {CURRENCIES.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                  Turnover (Million)
                </label>
                <input
                  type="number"
                  value={turnover}
                  onChange={(e) => setTurnover(e.target.value)}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-esg-teal hover:border-gray-300 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                  Balance Sheet (Million)
                </label>
                <input
                  type="number"
                  value={balanceSheet}
                  onChange={(e) => setBalanceSheet(e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-esg-teal hover:border-gray-300 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra-Jurisdictional Impact
                </label>
                <select
                  value={extraJurisdictional}
                  onChange={(e) => setExtraJurisdictional(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-esg-teal hover:border-esg-teal transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Year Range
                </label>
                <div className="flex gap-2 items-center">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">From</label>
                    <input
                      type="number"
                      value={yearRange[0]}
                      onChange={(e) => setYearRange([parseInt(e.target.value) || 1950, yearRange[1]])}
                      className="w-32 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-esg-teal hover:border-esg-teal transition-colors"
                    />
                  </div>
                  <span className="mt-5 text-gray-400">—</span>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">To</label>
                    <input
                      type="number"
                      value={yearRange[1]}
                      onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value) || new Date().getFullYear()])}
                      className="w-32 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-esg-teal hover:border-esg-teal transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TagFilter
                  label="Environmental"
                  options={ENVIRONMENTAL_TAGS}
                  selected={selectedEnvTags}
                  onChange={setSelectedEnvTags}
                />

                <TagFilter
                  label="Social"
                  options={SOCIAL_TAGS}
                  selected={selectedSocialTags}
                  onChange={setSelectedSocialTags}
                />

                <TagFilter
                  label="Governance"
                  options={GOVERNANCE_TAGS}
                  selected={selectedGovTags}
                  onChange={setSelectedGovTags}
                />
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {paginatedRegulations.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE + 1) : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredRegulations.length)} of {filteredRegulations.length} regulation{filteredRegulations.length !== 1 ? 's' : ''}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-esg-teal hover:text-esg-teal disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-esg-teal hover:text-esg-teal disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {paginatedRegulations.map((reg) => (
            <RegulationCard key={reg.metaId} regulation={reg} onViewDetails={() => setSelectedRegulation(reg)} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-esg-teal hover:text-esg-teal disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-esg-teal hover:text-esg-teal disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, options, selected, onChange }: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-left flex items-center justify-between hover:border-gray-300 transition-colors text-sm"
      >
        <span className="text-gray-900 truncate">
          {selected.length > 0 ? (
            <span>{selected.length} selected</span>
          ) : (
            <span className="text-gray-400">Select...</span>
          )}
        </span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {options.length > 10 && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-esg-teal"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <label key={option} className="flex items-center px-3 py-2 hover:bg-esg-teal hover:bg-opacity-10 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onChange([...selected, option]);
                        } else {
                          onChange(selected.filter(s => s !== option));
                        }
                      }}
                      className="mr-3 w-4 h-4 text-esg-teal border-gray-300 rounded focus:ring-esg-teal"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">No results found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TagFilter({ label, options, selected, onChange }: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-esg-black">
          {label} {selected.length > 0 && <span className="text-esg-teal">({selected.length})</span>}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-2 max-h-48 overflow-y-auto space-y-0.5">
          {options.map(option => (
            <label key={option} className="flex items-start cursor-pointer hover:bg-esg-teal hover:bg-opacity-10 p-1.5 rounded transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selected, option]);
                  } else {
                    onChange(selected.filter(s => s !== option));
                  }
                }}
                className="mr-2 mt-0.5 w-3.5 h-3.5 text-esg-teal border-gray-300 rounded focus:ring-esg-teal flex-shrink-0"
              />
              <span className="text-xs text-gray-700 leading-tight">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function RegulationCard({ regulation, onViewDetails }: { regulation: Regulation; onViewDetails: () => void }) {
  const getSubjectTags = () => {
    const tags = [];
    if (regulation.environmental) tags.push(...regulation.environmental.split(';').slice(0, 3));
    if (regulation.social) tags.push(...regulation.social.split(';').slice(0, 3));
    if (regulation.governance) tags.push(...regulation.governance.split(';').slice(0, 3));
    return tags.filter(t => t.trim()).slice(0, 6);
  };

  const getSectors = () => {
    if (!regulation.sector) return [];
    return regulation.sector.split(';').map(s => s.trim()).slice(0, 3);
  };

  const subjectTags = getSubjectTags();
  const sectors = getSectors();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-esg-teal hover:shadow-lg transition-all cursor-pointer" onClick={onViewDetails}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${
              regulation.obligation === 'Mandatory' ? 'bg-red-50 text-red-700' :
              regulation.obligation === 'Voluntary' ? 'bg-blue-50 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {regulation.obligation}
            </span>
            {regulation.country && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span>📍</span> {regulation.country}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-esg-black mb-3 leading-tight">{regulation.name}</h3>
          {regulation.summary && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{regulation.summary}</p>
          )}
        </div>
        {regulation.sourceUrl && (
          <a
            href={regulation.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 text-gray-400 hover:text-esg-teal transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={18} />
          </a>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
        {regulation.summary}
      </p>

      {regulation.authority && (
        <div className="text-xs text-gray-500 mb-5">
          <span className="font-medium text-gray-700">Authority:</span> {regulation.authority}
        </div>
      )}

      {(regulation.employeeCount || regulation.turnover || regulation.balanceSheet) && (
        <div className="mb-5 flex flex-wrap gap-3 text-xs">
          {regulation.employeeCount && (
            <div className="text-gray-500">
              <span className="font-medium text-gray-700">Employees:</span> {regulation.employeeCount}+
            </div>
          )}
          {regulation.turnover && (
            <div className="text-gray-500">
              <span className="font-medium text-gray-700">Turnover:</span> {regulation.currency || ''} {regulation.turnover}M
            </div>
          )}
          {regulation.balanceSheet && (
            <div className="text-gray-500">
              <span className="font-medium text-gray-700">Balance Sheet:</span> {regulation.currency || ''} {regulation.balanceSheet}M
            </div>
          )}
        </div>
      )}

      {sectors.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {sectors.map((sector, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                {sector}
              </span>
            ))}
            {regulation.sector.split(';').length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                +{regulation.sector.split(';').length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {subjectTags.length > 0 && (
        <div className="mb-0">
          <div className="flex flex-wrap gap-1.5">
            {subjectTags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
