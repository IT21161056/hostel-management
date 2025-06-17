import { useEffect, useState } from 'react';
import { UserCircle, AlertTriangle, Clock, CheckCircle, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import StudentLayout from '../../components/layouts/StudentLayout';
import StatCard from '../../components/ui/StatCard';
import { useAuthStore } from '../../stores/authStore';
import { Student, getStudentById } from '../../services/studentService';
import { Complaint, getComplaintsByStudentId } from '../../services/complaintService';
import { Visitor, getVisitorsByStudentId } from '../../services/visitorService';
import { COMPLAINT_STATUS } from '../../config/constants';

const StudentDashboardPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // In a real app, these would use the actual user ID
        const [studentData, complaintsData, visitorsData] = await Promise.all([
          getStudentById('1'), // Mocked to use ID 1 for demo
          getComplaintsByStudentId('1'), // Mocked to use ID 1 for demo
          getVisitorsByStudentId('1'), // Mocked to use ID 1 for demo
        ]);
        
        setStudent(studentData);
        setComplaints(complaintsData);
        setVisitors(visitorsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Get counts for different complaint statuses
  const openComplaints = complaints.filter(c => c.status === COMPLAINT_STATUS.OPEN).length;
  const inProgressComplaints = complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length;
  const resolvedComplaints = complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length;
  
  // Get active visitors count
  const activeVisitors = visitors.filter(v => v.checkOut === null).length;

  return (
    <StudentLayout title="Dashboard">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="fade-in">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-md p-6 mb-6 text-white">
            <h2 className="text-2xl font-semibold text-white">Welcome, {student?.name || user?.name}!</h2>
            <p className="mt-2 opacity-90">
              {student?.roomNumber 
                ? `You are assigned to room ${student.roomNumber}.` 
                : 'You have not been assigned a room yet.'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Room Status"
              value={student?.roomNumber || 'Not Assigned'}
              icon={<UserCircle className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="Open Complaints"
              value={openComplaints}
              icon={<AlertTriangle className="h-6 w-6" />}
              color="red"
            />
            <StatCard
              title="In Progress"
              value={inProgressComplaints}
              icon={<Clock className="h-6 w-6" />}
              color="amber"
            />
            <StatCard
              title="Resolved Issues"
              value={resolvedComplaints}
              icon={<CheckCircle className="h-6 w-6" />}
              color="teal"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Complaints */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
              </div>
              <div className="px-6 py-4">
                {complaints.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">You have no complaints.</p>
                ) : (
                  <div className="space-y-4">
                    {complaints.slice(0, 3).map((complaint) => (
                      <div key={complaint.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                        <div className={`mt-0.5 p-1.5 rounded-full 
                          ${complaint.status === COMPLAINT_STATUS.OPEN 
                            ? 'bg-red-100 text-red-600' 
                            : complaint.status === COMPLAINT_STATUS.IN_PROGRESS 
                            ? 'bg-amber-100 text-amber-600' 
                            : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {complaint.status === COMPLAINT_STATUS.OPEN && <AlertTriangle className="h-4 w-4" />}
                          {complaint.status === COMPLAINT_STATUS.IN_PROGRESS && <Clock className="h-4 w-4" />}
                          {complaint.status === COMPLAINT_STATUS.RESOLVED && <CheckCircle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{complaint.title}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(complaint.createdAt), 'MMM d, yyyy')} • 
                            <span className="ml-1 capitalize">{complaint.status}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {complaints.length > 3 && (
                      <div className="text-center pt-2">
                        <a href="/student/complaints" className="text-sm text-blue-600 hover:text-blue-800">
                          View all complaints
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Visitors */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Visitors</h3>
              </div>
              <div className="px-6 py-4">
                {visitors.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">You have no recent visitors.</p>
                ) : (
                  <div className="space-y-4">
                    {visitors.slice(0, 3).map((visitor) => (
                      <div key={visitor.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                        <div className={`mt-0.5 p-1.5 rounded-full 
                          ${visitor.checkOut === null 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-blue-100 text-blue-600'}`}
                        >
                          <UserCheck className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{visitor.name}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(visitor.checkIn), 'MMM d, yyyy')} • 
                            <span className="ml-1">{visitor.purpose}</span>
                          </p>
                        </div>
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full 
                            ${visitor.checkOut === null 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'}`}
                          >
                            {visitor.checkOut === null ? 'Active' : 'Checked Out'}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {visitors.length > 3 && (
                      <div className="text-center pt-2">
                        <a href="/student/visitors" className="text-sm text-blue-600 hover:text-blue-800">
                          View all visitors
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentDashboardPage;