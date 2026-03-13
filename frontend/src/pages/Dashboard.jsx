import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, UserCheck, Briefcase, UserPlus } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Candidates', value: stats?.total_candidates || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Applied', value: stats?.applied || 0, icon: UserPlus, color: 'bg-yellow-500' },
    { title: 'Interviewed', value: stats?.interviewed || 0, icon: Briefcase, color: 'bg-purple-500' },
    { title: 'Onboarded', value: stats?.onboarded || 0, icon: UserCheck, color: 'bg-accent' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Metrics and recent activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-colors duration-200">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{card.value}</p>
            </div>
            <div className={`w-12 h-12 ${card.color} bg-opacity-10 dark:bg-opacity-20 rounded-xl flex items-center justify-center`}>
              <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recent?.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{candidate.full_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{candidate.position}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(candidate.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!stats?.recent?.length && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No recent applications found.
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

export default Dashboard;
