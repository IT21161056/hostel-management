import { useEffect, useState } from 'react';
import { AtSign, Phone, UserCircle, DoorOpen, GraduationCap, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudentLayout from '../../components/layouts/StudentLayout';
import { useAuthStore } from '../../stores/authStore';
import { Student, getStudentById } from '../../services/studentService';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // In a real app, this would use the actual user ID
        const data = await getStudentById('1'); // Mocked to use ID 1 for demo
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  return (
    <StudentLayout title="My Profile">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="fade-in">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-8">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-teal-600 mb-4 md:mb-0 md:mr-6">
                  {student?.name.charAt(0) || user?.name.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white">{student?.name || user?.name}</h2>
                  <p className="text-teal-100 mt-1">Student ID: {student?.id || user?.id}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                    <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                      {student?.course || 'Computer Science'}
                    </span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Year {student?.year || '2'}
                    </span>
                    {student?.roomNumber && (
                      <span className="bg-teal-200 text-teal-800 text-xs px-2 py-1 rounded-full">
                        Room {student.roomNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserCircle className="h-5 w-5 mr-2 text-teal-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="text-gray-900">{student?.email || user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <GraduationCap className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Course</p>
                        <p className="text-gray-900">{student?.course || 'Computer Science'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <GraduationCap className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Year</p>
                        <p className="text-gray-900">Year {student?.year || '2'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DoorOpen className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Room Assignment</p>
                        <p className="text-gray-900">
                          {student?.roomNumber 
                            ? `Room ${student.roomNumber}` 
                            : 'Not assigned yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent/Guardian Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserCircle className="h-5 w-5 mr-2 text-teal-600" />
                    Parent/Guardian Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <UserCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-gray-900">{student?.parentDetails.name || 'Parent Name'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        <p className="text-gray-900">{student?.parentDetails.phone || '+1234567890'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <UserCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Relationship</p>
                        <p className="text-gray-900">{student?.parentDetails.relationship || 'Father'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AtSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{student?.parentDetails.email || 'parent@example.com'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons could be added here if needed */}
              <div className="mt-8 flex justify-end">
                <button className="btn btn-outline">Request Information Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default ProfilePage;