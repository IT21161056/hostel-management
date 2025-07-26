import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Shield } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import AddUserModal from "./AddUserModal";
import UsersTable from "./UsersTable";
import { User } from "./types";
import { useGetAllUsers } from "../../api/user";

// Mock users data (in real app, this would come from API)
const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@ananda.edu",
    nic: "123456789V",
    phone: "0711234567",
    role: "admin",
  },
  {
    id: "2",
    firstName: "Warden",
    lastName: "Kumar",
    email: "warden@ananda.edu",
    nic: "987654321V",
    phone: "0729876543",
    role: "warden",
  },
  {
    id: "3",
    firstName: "Lakshmi",
    lastName: "Perera",
    email: "lecturer@ananda.edu",
    nic: "456789123V",
    phone: "0774567891",
    role: "lecturer",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  const { hasPermission } = useAuth();

  const roles = ["admin", "warden", "lecturer"];

  const { data: userData, isLoading, refetch: refetchUsers } = useGetAllUsers();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "warden":
        return "Warden";
      case "lecturer":
        return "Lecturer";
      default:
        return role;
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, pageSize]);

  const handleAddUser = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleEditUser = (userData: Omit<User, "id">) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...userData,
                id: editingUser.id,
              }
            : u
        )
      );
      setEditingUser(undefined);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingUser(undefined);
  };

  if (!hasPermission("manage_users")) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600">
            Only administrators can manage user accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage system users and their permissions
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {getRoleLabel(role)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <UsersTable data={userData?.data} refetch={refetchUsers} />

      {/* Add/Edit User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={editingUser ? handleEditUser : handleAddUser}
        editUser={editingUser}
        refetch={refetchUsers}
      />
    </div>
  );
}
