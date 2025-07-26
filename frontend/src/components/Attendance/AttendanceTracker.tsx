import React, { useState } from 'react';
import { Check, X, Clock, Save } from 'lucide-react';
import { mockStudents, mockAttendance } from '../../data/mockData';
import { AttendanceRecord } from '../../types';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../Layout/ProtectedRoute';

export default function AttendanceTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const { hasPermission } = useAuth();

  const handleAttendanceChange = (studentId: string, status: string) => {
    if (!hasPermission('manage_attendance')) return;
    
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = () => {
    if (!hasPermission('manage_attendance')) return;
    
    console.log('Saving attendance for', selectedDate, attendanceData);
    // In real app, this would save to backend
  };

  return (
    <ProtectedRoute permission="manage_attendance" fallback={
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
        <p className="text-gray-600">You can view attendance records but cannot modify them.</p>
        <div className="mt-4 space-y-3">
          {mockStudents.slice(0, 5).map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{student.name}</h4>
                <p className="text-sm text-gray-500">{student.hostel} - Room {student.room}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Present
              </span>
            </div>
          ))}
        </div>
      </div>
    }>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Mark Attendance</h3>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Attendance
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {mockStudents.map((student) => {
              const currentStatus = attendanceData[student.id] || 'present';
              
              return (
                <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-500">{student.hostel} - Room {student.room}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'present')}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                        currentStatus === 'present'
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Present
                    </button>
                    
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'absent')}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                        currentStatus === 'absent'
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                      }`}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Absent
                    </button>
                    
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'leave')}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                        currentStatus === 'leave'
                          ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Leave
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}