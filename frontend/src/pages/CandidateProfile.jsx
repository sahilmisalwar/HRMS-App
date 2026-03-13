import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, User, Mail, Phone, Briefcase, FileText, Download } from 'lucide-react';

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [offerSalary, setOfferSalary] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerManagerName, setOfferManagerName] = useState('');
  const [offerExpirationDate, setOfferExpirationDate] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);

  const fetchCandidate = async () => {
    try {
      const res = await api.get(`/candidates/${id}`);
      setCandidate(res.data);
      setStatus(res.data.status);
    } catch (error) {
      console.error("Failed to fetch candidate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/candidates/${id}`, { status });
      fetchCandidate();
      alert("Status updated successfully");
    } catch (error) {
       console.error("Failed to update status");
    }
  };

  const handleGenerateOffer = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('salary', offerSalary);
      formData.append('joining_date', offerDate);
      formData.append('manager_name', offerManagerName);
      formData.append('expiration_date', offerExpirationDate);
      
      await api.post(`/candidates/${id}/generate_offer`, formData);
      setShowOfferModal(false);
      fetchCandidate();
      alert("Offer letter generated successfully!");
    } catch (error) {
      console.error("Failed to generate offer");
      alert("Error generating offer");
    }
  };

  const handleDownloadDoc = async (docId, filename) => {
    try {
      const res = await api.get(`/documents/${docId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download document");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!candidate) return <div className="p-6">Candidate not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate('/candidates')} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Candidates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{candidate.full_name}</h1>
                <p className="text-primary dark:text-blue-400 font-medium mt-1">{candidate.position}</p>
              </div>
              <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                candidate.status === 'Applied' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                candidate.status === 'Interviewed' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                candidate.status === 'Offered' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                candidate.status === 'Onboarded' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {candidate.status}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                {candidate.email}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                {candidate.phone}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Briefcase className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                Applied: {new Date(candidate.created_at).toLocaleDateString()}
              </div>
            </div>

            {candidate.notes && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">Notes</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-gray-700 dark:text-gray-300 text-sm">
                  {candidate.notes}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Documents</h2>
              <button className="text-sm font-medium text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Upload New</button>
            </div>
            
            <div className="space-y-3">
              {candidate.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-primary dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.filename}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{doc.doc_type} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDownloadDoc(doc.id, doc.filename)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-blue-400 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {candidate.documents.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No documents uploaded.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Workflow Actions</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Status</label>
                <div className="flex gap-2">
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm transition-colors"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Offered">Offered</option>
                    <option value="Onboarded">Onboarded</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button onClick={handleStatusUpdate} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Update
                  </button>
                </div>
              </div>

              {candidate.status === 'Offered' && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => setShowOfferModal(true)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-green-600 transition-colors">
                    Generate Offer Letter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showOfferModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-80 overflow-y-auto h-full w-full flex items-center justify-center transition-colors">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md transition-colors duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Generate Offer Letter</h3>
            <form onSubmit={handleGenerateOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Annual Salary (e.g. $80,000)</label>
                <input required type="text" value={offerSalary} onChange={e => setOfferSalary(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joining Date</label>
                <input required type="date" value={offerDate} onChange={e => setOfferDate(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reporting Manager Name</label>
                <input required type="text" value={offerManagerName} onChange={e => setOfferManagerName(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Offer Expiration Date</label>
                <input required type="date" value={offerExpirationDate} onChange={e => setOfferExpirationDate(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-primary focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowOfferModal(false)} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Generate PDF</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
