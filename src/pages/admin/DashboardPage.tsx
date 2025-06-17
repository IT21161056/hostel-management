import { useEffect, useState } from 'react';
import { Users, DoorOpen, AlertTriangle, UserCheck } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import AdminLayout from '../../components/layouts/AdminLayout';
import StatCard from '../../components/ui/StatCard';
import { getStudents } from '../../services/studentService';
import { getRooms } from '../../services/roomService';
import { getComplaints } from '../../services/complaintService';
import { getVisitors } from '../../services/visitorService';
import { COMPLAINT_STATUS } from '../../config/constants';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    vacantRooms: 0,
    openComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    activeVisitors: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [students, rooms, complaints, visitors] = await Promise.all([
          getStudents(),
          getRooms(),
          getComplaints(),
          getVisitors(),
        ]);

        setStats({
          totalStudents: students.length,
          totalRooms: rooms.length,
          occupiedRooms: rooms.filter(room => room.occupancy > 0).length,
          vacantRooms: rooms.filter(room => room.occupancy === 0).length,
          openComplaints: complaints.filter(c => c.status === COMPLAINT_STATUS.OPEN).length,
          inProgressComplaints: complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length,
          resolvedComplaints: complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length,
          activeVisitors: visitors.filter(v => v.checkOut === null).length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Occupancy chart data
  const occupancyData = {
    labels: ['Occupied Rooms', 'Vacant Rooms'],
    datasets: [
      {
        data: [stats.occupiedRooms, stats.vacantRooms],
        backgroundColor: ['#3B82F6', '#E5E7EB'],
        borderColor: ['#2563EB', '#D1D5DB'],
        borderWidth: 1,
      },
    ],
  };

  // Complaints chart data
  const complaintsData = {
    labels: ['Open', 'In Progress', 'Resolved'],
    datasets: [
      {
        label: 'Complaints',
        data: [stats.openComplaints, stats.inProgressComplaints, stats.resolvedComplaints],
        backgroundColor: ['#F59E0B', '#6366F1', '#10B981'],
      },
    ],
  };

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={<Users className="h-6 w-6" />}
              color="blue"
              change={{ value: 12, type: 'increase' }}
            />
            <StatCard
              title="Total Rooms"
              value={stats.totalRooms}
              icon={<DoorOpen className="h-6 w-6" />}
              color="teal"
            />
            <StatCard
              title="Open Complaints"
              value={stats.openComplaints}
              icon={<AlertTriangle className="h-6 w-6" />}
              color="amber"
              change={{ value: 5, type: 'decrease' }}
            />
            <StatCard
              title="Active Visitors"
              value={stats.activeVisitors}
              icon={<UserCheck className="h-6 w-6" />}
              color="purple"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Room Occupancy</h2>
              <div className="h-64 flex items-center justify-center">
                <Doughnut
                  data={occupancyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = (stats.occupiedRooms + stats.vacantRooms);
                            const percentage = total > 0 ? Math.round((value as number / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Complaint Status</h2>
              <div className="h-64 flex items-center justify-center">
                <Bar
                  data={complaintsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recent activity section could be added here */}
        </div>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;