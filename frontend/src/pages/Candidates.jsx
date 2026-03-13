import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, Filter, Eye, Trash2, Edit } from 'lucide-react';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/candidates', {
        params: { search, status: statusFilter || null }
      });
      setCandidates(res.data);
    } catch (error) {
      console.error("Failed to fetch candidates");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      await api.delete(`/candidates/${id}`);
      fetchCandidates();
    }
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Status', 'Applied Date'];
    csvRows.push(headers.join(','));
    
    for (const candidate of candidates) {
      const row = [
        candidate.full_name,
        candidate.email,
        candidate.phone,
        candidate.position,
        candidate.status,
        new Date(candidate.created_at).toLocaleDateString()
      ];
      csvRows.push(row.map(e => `"${e}"`).join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'candidates.csv');
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Candidates</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage all your applicants</p>
        </div>
        <div className="flex gap-3">
          <button onClick={downloadCSV} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export CSV
          </button>
          <Link to="/candidates/add" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Add Candidate
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 transition-colors duration-200">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-sm appearance-none text-gray-900 dark:text-gray-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Offered">Offered</option>
            <option value="Onboarded">Onboarded</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidate Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{candidate.full_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Applied: {new Date(candidate.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{candidate.email}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{candidate.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{candidate.position}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      candidate.status === 'Applied' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      candidate.status === 'Interviewed' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      candidate.status === 'Offered' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      candidate.status === 'Onboarded' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-2">
                    <Link to={`/candidates/${candidate.id}`} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(candidate.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
