import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    notes: '',
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/candidates', formData);
      const candidateId = res.data.id;
      
      if (resume) {
        const fileData = new FormData();
        fileData.append('file', resume);
        fileData.append('doc_type', 'Resume');
        await api.post(`/candidates/${candidateId}/documents`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      navigate('/candidates');
    } catch (error) {
      console.error("Failed to add candidate", error);
      alert("Error adding candidate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Add New Candidate</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position Applied For</label>
              <input type="text" name="position" required value={formData.position} onChange={handleChange} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
            <textarea name="notes" rows="4" value={formData.notes} onChange={handleChange} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume Upload (PDF/DOC)</label>
             <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/40 file:text-primary dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60 transition-colors" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={() => navigate('/candidates')} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors">
              {loading ? 'Saving...' : 'Save Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
