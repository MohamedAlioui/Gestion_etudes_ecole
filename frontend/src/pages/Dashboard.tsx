import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users,
  GraduationCap,
  School,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  recentActivities: Array<{
    type: string;
    description: string;
    time: string;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalRevenue: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [studentsRes, teachersRes, classesRes, financeRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/eleves`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/enseignants`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/classes`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/seances`)
        ]);
        
        setStats({
          totalStudents: studentsRes.data.length,
          totalTeachers: teachersRes.data.length,
          totalClasses: classesRes.data.length,
          totalRevenue: financeRes.data.length || 0,
          recentActivities: [
            {
              type: 'student',
              description: 'تم تسجيل طالب جديد',
              time: 'منذ 5 دقائق'
            },
            {
              type: 'payment',
              description: 'تم تسجيل دفعة جديدة',
              time: 'منذ 15 دقائق'
            }
          ]
        });
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />} label="إجمالي الطلاب" value={stats.totalStudents} />
        <StatCard icon={<GraduationCap className="h-6 w-6 text-green-600 dark:text-green-300" />} label="إجمالي المعلمين" value={stats.totalTeachers} />
        <StatCard icon={<School className="h-6 w-6 text-purple-600 dark:text-purple-300" />} label="إجمالي الفصول" value={stats.totalClasses} />
        <StatCard icon={<Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />} label="إجمالي الحصص" value={stats.totalRevenue} />
      </div>

      <RecentActivities activities={stats.recentActivities} />
    </div>
  );
};

// Component for displaying a statistic card
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
        {icon}
      </div>
      <div className="mr-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

// Component for displaying recent activities
const RecentActivities = ({ activities }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">النشاطات الأخيرة</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;