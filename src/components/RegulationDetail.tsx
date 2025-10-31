import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Bookmark, Share2, Bell, Calendar, Building2, Tag } from 'lucide-react';
import { Regulation } from '../types/regulation';

interface RegulationDetailProps {
  regulation: Regulation;
  regulations: Regulation[];
  onBack: () => void;
  onSelectRegulation?: (regulation: Regulation) => void;
}

export default function RegulationDetail({ regulation, regulations, onBack, onSelectRegulation }: RegulationDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Parse related regulations as simple text entries (semicolon-separated)
  const relatedRegulationsList = regulation.relatedRegulations
    ? regulation.relatedRegulations
        .split(';') // Split by semicolon only
        .map(name => name.trim())
        .filter(name => name)
    : [];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 2000);
  };

  const getSubjectTags = () => {
    const tags = [];
    if (regulation.environmental) tags.push(...regulation.environmental.split(';').map(t => ({ label: t.trim(), category: 'Environmental' })));
    if (regulation.social) tags.push(...regulation.social.split(';').map(t => ({ label: t.trim(), category: 'Social' })));
    if (regulation.governance) tags.push(...regulation.governance.split(';').map(t => ({ label: t.trim(), category: 'Governance' })));
    return tags.filter(t => t.label);
  };

  const subjectTags = getSubjectTags();

  return (
    <div className="min-h-screen bg-esg-teal-light">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-esg-black transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Back to Explore
          </button>
          <div className="text-right text-sm text-gray-500 -mt-6">
            ESG Book Explore<br/>
            Regulation Details
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-esg-black mb-5 leading-tight">{regulation.name}</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                    {regulation.country}
                  </span>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md text-sm">
                    {regulation.region}
                  </span>
                  <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                    regulation.obligation === 'Mandatory' ? 'bg-red-50 text-red-700' :
                    regulation.obligation === 'Voluntary' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {regulation.obligation}
                  </span>
                </div>
              </div>
              {regulation.sourceUrl && (
                <a
                  href={regulation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 text-gray-400 hover:text-esg-teal transition-colors"
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </div>

            <div className="mb-8 p-5 bg-gray-50 rounded-xl">
              <h2 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors text-sm ${
                    isBookmarked
                      ? 'bg-esg-teal text-esg-black border-esg-teal'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-esg-teal'
                  }`}
                >
                  <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-white text-gray-700 border-gray-200 hover:border-esg-teal transition-colors text-sm"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-white text-gray-700 border-gray-200 hover:border-esg-teal transition-colors text-sm"
                >
                  <Bell size={16} />
                  Set Alert
                </button>
              </div>
            </div>

            {regulation.summary && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Summary</h2>
                <p className="text-gray-600 leading-relaxed">{regulation.summary}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Calendar size={16} className="text-gray-600" />
                  Timeline
                </h3>
                <div className="space-y-2">
                  {regulation.publicationDate && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">Publication Date:</span>
                      <span className="text-gray-500 ml-2">{regulation.publicationDate}</span>
                    </div>
                  )}
                  {regulation.entryIntoForce && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Entry Into Force:</span>
                      <span className="text-gray-600 ml-2">{regulation.entryIntoForce}</span>
                    </div>
                  )}
                  {regulation.applicabilityDate && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Applicability Date:</span>
                      <span className="text-gray-600 ml-2">{regulation.applicabilityDate}</span>
                    </div>
                  )}
                  {regulation.currentStage && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Current Stage:</span>
                      <span className="text-gray-600 ml-2">{regulation.currentStage}</span>
                    </div>
                  )}
                </div>
              </div>

              {(regulation.employeeCount || regulation.balanceSheet || regulation.turnover) && (
                <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <Building2 size={16} className="text-gray-600" />
                    Thresholds
                  </h3>
                  <div className="space-y-2">
                    {regulation.employeeCount && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Employee Count:</span>
                        <span className="text-gray-600 ml-2">{regulation.employeeCount}</span>
                      </div>
                    )}
                    {regulation.balanceSheet && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Balance Sheet Size:</span>
                        <span className="text-gray-600 ml-2">{regulation.balanceSheet} {regulation.currency || 'million'}</span>
                      </div>
                    )}
                    {regulation.turnover && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Turnover:</span>
                        <span className="text-gray-600 ml-2">{regulation.turnover} {regulation.currency || 'million'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {regulation.authority && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Authority</h3>
                <p className="text-gray-600">{regulation.authority}</p>
              </div>
            )}

            {regulation.applicability && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Applicability</h3>
                <p className="text-gray-600">{regulation.applicability}</p>
              </div>
            )}

            {regulation.sector && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Building2 size={16} className="text-gray-600" />
                  Sectors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {regulation.sector.split(';').map((sector, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm">
                      {sector.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {subjectTags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Tag size={16} className="text-gray-600" />
                  Subject Tags
                </h3>
                <div className="space-y-3">
                  {['Environmental', 'Social', 'Governance'].map(category => {
                    const categoryTags = subjectTags.filter(t => t.category === category);
                    if (categoryTags.length === 0) return null;
                    return (
                      <div key={category}>
                        <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">{category}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {categoryTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-md text-sm ${
                                category === 'Environmental' ? 'bg-green-50 text-green-700' :
                                category === 'Social' ? 'bg-blue-50 text-blue-700' :
                                'bg-orange-50 text-orange-700'
                              }`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {relatedRegulationsList.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-esg-black mb-6">Related Regulations</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ul className="space-y-3">
                {relatedRegulationsList.map((regName, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-esg-teal mt-1.5">•</span>
                    <span className="text-gray-700 leading-relaxed">{regName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed bottom-6 right-6 bg-esg-black text-white px-5 py-3 rounded-lg shadow-lg text-sm">
          Link copied to clipboard
        </div>
      )}

      {showAlertModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowAlertModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-8 z-50 w-full max-w-md">
            <h3 className="text-xl font-light text-gray-900 mb-4">Set Email Alert</h3>
            <p className="text-gray-600 mb-4">
              Get notified when there are updates to this regulation.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 mb-4 focus:outline-none focus:border-gray-400"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAlertModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-esg-teal text-esg-black rounded-lg hover:bg-opacity-90 transition-colors font-medium text-sm"
              >
                Set Alert
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
