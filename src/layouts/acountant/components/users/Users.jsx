import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import tableGirl from "@/assets/nursing/table-girl.png";
import tableEye from "@/assets/nursing/table-eye.png";
import pencilIcon from "@/assets/nursing/pencil-black.png";
import trashIcon from "@/assets/nursing/trash-black.png";
import apiClient from "@/api/apiClient";
import Loader from "@/components/ui/Loader";
import AddUserModal from "./modals/AddUserModal";
import EditUserModal from "./modals/EditUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";
import PreviewUserModal from "./modals/PreviewUserModal";

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    // Fetch users and filter by role "USR"
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get("/user");
            if (response.ok) {
                const filteredUsers = response.data.filter((user) => user.role !== "ADM");
                setUsers(filteredUsers || []);
                if (filteredUsers.length === 0) {
                    toast("No users found with role USR", { icon: "ℹ️" });
                }
            } else {
                toast.error(response.data?.message || "Failed to fetch users");
            }
        } catch (error) {
            toast.error(error.message || "Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    // Callback to add a new user
    const onAddUser = async (data) => {
        setLoading(true);
        toast.loading("Adding user...");
        try {
            const response = await apiClient.post("/auth/register", {
                ...data,
                role: "USR",
            });
            if (response.ok) {
                toast.dismiss();
                toast.success("User added successfully!");
                fetchUsers();
                setIsAddModalOpen(false);
            } else {
                throw new Error(response.data?.message || "Failed to add user");
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.message || "Error adding user");
        } finally {
            setLoading(false);
        }
    };

    // Callback to update an existing user
    const onUpdateUser = async (data) => {
        if (!selectedUser) return;
        setLoading(true);
        toast.loading("Updating user...");
        try {
            const response = await apiClient.patch(`/user/${selectedUser.id}`, {
                ...data,
                role: "USR",
            });
            if (response.ok) {
                toast.dismiss();
                toast.success("User updated successfully!");
                setUsers(
                    users.map((user) =>
                        user.id === selectedUser.id ? { ...user, ...response.data } : user
                    )
                );
                setIsEditModalOpen(false);
                setSelectedUser(null);
            } else {
                throw new Error(response.data?.message || "Failed to update user");
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.message || "Error updating user");
        } finally {
            setLoading(false);
        }
    };

    // Callback to delete a user
    const onDeleteUser = async (id) => {
        setLoading(true);
        toast.loading("Deleting user...");
        try {
            const response = await apiClient.delete(`/user/${id}`);
            if (response.ok) {
                toast.dismiss();
                toast.success("User deleted successfully!");
                setUsers(users.filter((user) => user.id !== id));
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
            } else {
                throw new Error(response.data?.message || "Failed to delete user");
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.message || "Error deleting user");
        } finally {
            setLoading(false);
        }
    };

    // Preview user details
    const previewUserDetails = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/user/${id}`);
            if (response.ok && response.data.role === "USR") {
                setSelectedUser(response.data);
                setIsPreviewModalOpen(true);
            } else {
                toast.error("User not found or not a USR role");
            }
        } catch (error) {
            toast.error(error.message || "Error fetching user details");
        } finally {
            setLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    // Open delete confirmation modal
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="md:p-6  flex flex-col items-center">
            <div className="bg-white md:p-6 p-4 rounded-lg shadow-md overflow-x-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Users List</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-orange-600 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        Add User
                    </button>
                </div>

                {/* Table Wrapper */}
                <div className="relative overflow-auto w-[80vw]">
                    {loading && <Loader />}
                    {users.length === 0 && !loading && (
                        <div className="text-center py-4 text-gray-500">No users available with role USR</div>
                    )}
                    <table className="w-full text-sm text-left text-gray-500 border-separate border-spacing-y-3">
                        <thead className="text-xs text-white uppercase bg-[#242E4C] rounded-2xl">
                            <tr>
                                <th className="px-6 py-7 rounded-s-2xl">ID</th>
                                <th className="px-6 py-4">User Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Contact No.</th>
                                <th className="px-6 py-4">Program Type</th>
                                <th className="px-6 py-4 rounded-e-2xl">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="bg-white shadow-md rounded-2xl">
                                    <td className="px-6 py-4 rounded-s-2xl">{user?.id?.slice(0, 5).toUpperCase()}</td>
                                    <td className="px-6 py-4 flex items-center space-x-2">
                                        <img
                                            src={user.avatar || tableGirl}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full border"
                                            onError={(e) => (e.target.src = tableGirl)}
                                        />
                                        <span className="whitespace-nowrap">
                                            {user.first_name || "N/A"} {user.last_name || ""}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.phone || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.program_type || "N/A"}</td>
                                    <td className="px-6 py-4 flex flex-wrap gap-1 rounded-e-2xl">
                                        <button
                                            onClick={() => previewUserDetails(user.id)}
                                            disabled={loading}
                                            className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
                                            title="View Details"
                                        >
                                            <img src={tableEye} alt="View" className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(user)}
                                            disabled={loading}
                                            className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
                                            title="Edit User"
                                        >
                                            <img src={pencilIcon} alt="Edit" className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(user)}
                                            disabled={loading}
                                            className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
                                            title="Delete User"
                                        >
                                            <img src={trashIcon} alt="Delete" className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-gray-900 bg-gray-100">
                                <th className="px-6 py-3 text-base rounded-bl-2xl">Total Users</th>
                                <td className="px-6 py-3">{users.length}</td>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3 rounded-br-2xl"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Modal Components */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddUser={onAddUser}
                loading={loading}
            />
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                onUpdateUser={onUpdateUser}
                loading={loading}
            />
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                user={userToDelete}
                onDeleteUser={onDeleteUser}
                loading={loading}
            />
            <PreviewUserModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                user={selectedUser}
            />
        </div>
    );
};

export default UsersTable;

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import tableGirl from "@/assets/nursing/table-girl.png";
// import tableEye from "@/assets/nursing/table-eye.png";
// import pencilIcon from "@/assets/nursing/pencil-black.png";
// import trashIcon from "@/assets/nursing/trash-black.png";
// import apiClient from "@/api/apiClient";
// import Loader from "@/components/ui/Loader"; // Import the reusable Loader component

// const UsersTable = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false); // New state for add modal
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [userToDelete, setUserToDelete] = useState(null);

//     const { register, handleSubmit, reset, formState: { errors } } = useForm();

//     // Fetch users and filter by role "USR"
//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get("/user");
//             if (response.ok) {
//                 const filteredUsers = response.data.filter(user => user.role !== "ADM");
//                 setUsers(filteredUsers || []);
//                 if (filteredUsers.length === 0) {
//                     toast("No users found with role USR", { icon: "ℹ️" });
//                 }
//             } else {
//                 toast.error(response.data?.message || "Failed to fetch users");
//             }
//         } catch (error) {
//             toast.error(error.message || "Error fetching users");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Preview user details
//     const previewUserDetails = async (id) => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get(`/user/${id}`);
//             if (response.ok && response.data.role === "USR") {
//                 setSelectedUser(response.data);
//                 setIsPreviewModalOpen(true);
//             } else {
//                 toast.error("User not found or not a USR role");
//             }
//         } catch (error) {
//             toast.error(error.message || "Error fetching user details");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete user
//     const deleteUser = async () => {
//         if (!userToDelete) return;
//         setLoading(true);
//         toast.loading("Deleting user...");
//         try {
//             const response = await apiClient.delete(`/user/${userToDelete.id}`);
//             if (response.ok) {
//                 toast.dismiss();
//                 toast.success("User deleted successfully!");
//                 setUsers(users.filter((user) => user.id !== userToDelete.id));
//                 setIsDeleteModalOpen(false);
//                 setUserToDelete(null);
//             } else {
//                 throw new Error(response.data?.message || "Failed to delete user");
//             }
//         } catch (error) {
//             toast.dismiss();
//             toast.error(error.message || "Error deleting user");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Open edit modal and populate form
//     const openEditModal = (user) => {
//         setSelectedUser(user);
//         reset({
//             first_name: user.first_name || "",
//             last_name: user.last_name || "",
//             phone: user.phone || "",
//             program_type: user.program_type || "",
//             role: user.role || "",
//         });
//         setIsEditModalOpen(true);
//     };

//     // Partially update user
//     const updateUser = async (data) => {
//         if (!selectedUser) return;
//         setLoading(true);
//         toast.loading("Updating user...");
//         try {
//             const response = await apiClient.patch(`/user/${selectedUser.id}`, {
//                 first_name: data.first_name,
//                 last_name: data.last_name,
//                 phone: data.phone,
//                 program_type: data.program_type || null,
//                 role: "USR", // Ensure role remains "USR"
//             });
//             if (response.ok) {
//                 toast.dismiss();
//                 toast.success("User updated successfully!");
//                 setUsers(
//                     users.map((user) =>
//                         user.id === selectedUser.id ? { ...user, ...response.data } : user
//                     )
//                 );
//                 setIsEditModalOpen(false);
//                 setSelectedUser(null);
//                 reset();
//             } else {
//                 throw new Error(response.data?.message || "Failed to update user");
//             }
//         } catch (error) {
//             toast.dismiss();
//             toast.error(error.message || "Error updating user");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Add new user with role "USR"
//     const addUser = async (data) => {
//         setLoading(true);
//         toast.loading("Adding user...");
//         try {
//             const response = await apiClient.post("/user", {
//                 first_name: data.first_name,
//                 last_name: data.last_name,
//                 email: data.email,
//                 phone: data.phone,
//                 program_type: data.program_type || null,
//                 role: "USR", // Hardcode role as "USR"
//             });
//             if (response.ok) {
//                 toast.dismiss();
//                 toast.success("User added successfully!");
//                 fetchUsers(); // Refresh the list
//                 setIsAddModalOpen(false);
//                 reset();
//             } else {
//                 throw new Error(response.data?.message || "Failed to add user");
//             }
//         } catch (error) {
//             toast.dismiss();
//             toast.error(error.message || "Error adding user");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Open delete confirmation modal
//     const openDeleteModal = (user) => {
//         setUserToDelete(user);
//         setIsDeleteModalOpen(true);
//     };

//     // Close modals
//     const closeModals = () => {
//         setIsEditModalOpen(false);
//         setIsDeleteModalOpen(false);
//         setIsPreviewModalOpen(false);
//         setIsAddModalOpen(false);
//         setSelectedUser(null);
//         setUserToDelete(null);
//         reset();
//     };

//     // Fetch users on component mount
//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     return (
//         <div className="md:p-6 min-h-screen flex flex-col items-center">
//             <div className="bg-white md:p-6 p-4 rounded-lg shadow-md overflow-x-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-semibold">Users List</h2>
//                     <button
//                         onClick={() => setIsAddModalOpen(true)}
//                         className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-orange-600 transition disabled:opacity-50"
//                         disabled={loading}
//                     >
//                         Add User
//                     </button>
//                 </div>

//                 {/* Table Wrapper */}
//                 <div className="relative overflow-auto w-[80vw]">
//                     {loading && <Loader />}
//                     {users.length === 0 && !loading && (
//                         <div className="text-center py-4 text-gray-500">No users available with role USR</div>
//                     )}
//                     <table className="w-full text-sm text-left text-gray-500 border-separate border-spacing-y-3">
//                         <thead className="text-xs text-white uppercase bg-[#242E4C] rounded-2xl">
//                             <tr>
//                                 <th className="px-6 py-7 rounded-s-2xl">ID</th>
//                                 <th className="px-6 py-4">User Name</th>
//                                 <th className="px-6 py-4">Email</th>
//                                 <th className="px-6 py-4">Contact No.</th>
//                                 <th className="px-6 py-4">Program Type</th>
//                                 <th className="px-6 py-4 rounded-e-2xl">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((user) => (
//                                 <tr key={user.id} className="bg-white shadow-md rounded-2xl">
//                                     <td className="px-6 py-4 rounded-s-2xl">{user.id}</td>
//                                     <td className="px-6 py-4 flex items-center space-x-2">
//                                         <img
//                                             src={user.avatar || tableGirl}
//                                             alt="Avatar"
//                                             className="w-10 h-10 rounded-full border"
//                                             onError={(e) => (e.target.src = tableGirl)}
//                                         />
//                                         <span className="whitespace-nowrap">
//                                             {user.first_name || "N/A"} {user.last_name || ""}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.email || "N/A"}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.phone || "N/A"}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.program_type || "N/A"}</td>
//                                     <td className="px-6 py-4 flex flex-wrap gap-1 rounded-e-2xl">
//                                         <button
//                                             onClick={() => previewUserDetails(user.id)}
//                                             disabled={loading}
//                                             className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
//                                             title="View Details"
//                                         >
//                                             <img src={tableEye} alt="View" className="w-5 h-5" />
//                                         </button>
//                                         <button
//                                             onClick={() => openEditModal(user)}
//                                             disabled={loading}
//                                             className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
//                                             title="Edit User"
//                                         >
//                                             <img src={pencilIcon} alt="Edit" className="w-5 h-5" />
//                                         </button>
//                                         <button
//                                             onClick={() => openDeleteModal(user)}
//                                             disabled={loading}
//                                             className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
//                                             title="Delete User"
//                                         >
//                                             <img src={trashIcon} alt="Delete" className="w-5 h-5" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                         <tfoot>
//                             <tr className="font-semibold text-gray-900 bg-gray-100">
//                                 <th className="px-6 py-3 text-base rounded-bl-2xl">Total Users</th>
//                                 <td className="px-6 py-3">{users.length}</td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3 rounded-br-2xl"></td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             </div>

//             {/* Edit Modal */}
//             {isEditModalOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//                     onClick={closeModals}
//                 >
//                     <div
//                         className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Edit User</h3>
//                         <form onSubmit={handleSubmit(updateUser)}>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">First Name</label>
//                                 <input
//                                     {...register("first_name", { required: "First name is required" })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.first_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Last Name</label>
//                                 <input
//                                     {...register("last_name", { required: "Last name is required" })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.last_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Phone</label>
//                                 <input
//                                     {...register("phone", {
//                                         required: "Phone is required",
//                                         pattern: {
//                                             value: /^\+?[1-9]\d{1,14}$/,
//                                             message: "Invalid phone number",
//                                         },
//                                     })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.phone && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Program Type</label>
//                                 <input
//                                     {...register("program_type")}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={closeModals}
//                                     disabled={loading}
//                                     className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {isDeleteModalOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//                     onClick={closeModals}
//                 >
//                     <div
//                         className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
//                         <p className="text-gray-600 mb-6">
//                             Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}?
//                         </p>
//                         <div className="flex justify-end gap-2">
//                             <button
//                                 onClick={closeModals}
//                                 disabled={loading}
//                                 className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={deleteUser}
//                                 disabled={loading}
//                                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Preview Modal */}
//             {isPreviewModalOpen && selectedUser && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//                     onClick={closeModals}
//                 >
//                     <div
//                         className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">User Details</h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <span className="font-medium">ID:</span> {selectedUser.id}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Name:</span>{" "}
//                                 {selectedUser.first_name || "N/A"} {selectedUser.last_name || ""}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Email:</span> {selectedUser.email || "N/A"}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Phone:</span> {selectedUser.phone || "N/A"}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Program Type:</span>{" "}
//                                 {selectedUser.program_type || "N/A"}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Role:</span> {selectedUser.role || "N/A"}
//                             </div>
//                         </div>
//                         <div className="flex justify-end mt-6">
//                             <button
//                                 onClick={closeModals}
//                                 disabled={loading}
//                                 className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add New User Modal */}
//             {isAddModalOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//                     onClick={closeModals}
//                 >
//                     <div
//                         className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Add New User</h3>
//                         <form onSubmit={handleSubmit(addUser)}>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">First Name</label>
//                                 <input
//                                     {...register("first_name", { required: "First name is required" })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.first_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Last Name</label>
//                                 <input
//                                     {...register("last_name", { required: "Last name is required" })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.last_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Email</label>
//                                 <input
//                                     {...register("email", {
//                                         required: "Email is required",
//                                         pattern: {
//                                             value: /^\S+@\S+\.\S+$/,
//                                             message: "Invalid email address",
//                                         },
//                                     })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.email && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Phone</label>
//                                 <input
//                                     {...register("phone", {
//                                         required: "Phone is required",
//                                         pattern: {
//                                             value: /^\+?[1-9]\d{1,14}$/,
//                                             message: "Invalid phone number",
//                                         },
//                                     })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.phone && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Program Type</label>
//                                 <input
//                                     {...register("program_type")}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={closeModals}
//                                     disabled={loading}
//                                     className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
//                                 >
//                                     Add User
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UsersTable;

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import tableGirl from "@/assets/nursing/table-girl.png";
// import tableEye from "@/assets/nursing/table-eye.png";
// import pencilIcon from "@/assets/nursing/pencil-black.png";
// import trashIcon from "@/assets/nursing/trash-black.png";
// import apiClient from "@/api/apiClient";

// const UsersTable = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [userToDelete, setUserToDelete] = useState(null);

//     const { register, handleSubmit, reset, formState: { errors } } = useForm();

//     // Fetch all users
//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get("/user");
//             if (response.ok) {
//                 setUsers(response.data || []);
//                 if (response.data.length === 0) {
//                     toast("No users found", { icon: "ℹ️" });
//                 }
//             } else {
//                 toast.error(response.data?.message || "Failed to fetch users");
//             }
//         } catch (error) {
//             toast.error(error.message || "Error fetching users");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Preview user details
//     const previewUserDetails = async (id) => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get(`/user/${id}`);
//             if (response.ok) {
//                 setSelectedUser(response.data);
//                 setIsPreviewModalOpen(true);
//             } else {
//                 toast.error(response.data?.message || "Failed to fetch user details");
//             }
//         } catch (error) {
//             toast.error(error.message || "Error fetching user details");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete user
//     const deleteUser = async () => {
//         if (!userToDelete) return;
//         setLoading(true);
//         toast.loading("Deleting user...");
//         try {
//             const response = await apiClient.delete(`/user/${userToDelete.id}`);
//             if (response.ok) {
//                 toast.dismiss();
//                 toast.success("User deleted successfully!");
//                 setUsers(users.filter((user) => user.id !== userToDelete.id));
//                 setIsDeleteModalOpen(false);
//                 setUserToDelete(null);
//             } else {
//                 throw new Error(response.data?.message || "Failed to delete user");
//             }
//         } catch (error) {
//             toast.dismiss();
//             toast.error(error.message || "Error deleting user");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Open edit modal and populate form
//     const openEditModal = (user) => {
//         setSelectedUser(user);
//         reset({
//             first_name: user.first_name || "",
//             last_name: user.last_name || "",
//             phone: user.phone || "",
//             program_type: user.program_type || "",
//             role: user.role || "",
//         });
//         setIsEditModalOpen(true);
//     };

//     // Partially update user
//     const updateUser = async (data) => {
//         if (!selectedUser) return;
//         setLoading(true);
//         toast.loading("Updating user...");
//         try {
//             const response = await apiClient.patch(`/user/${selectedUser.id}`, {
//                 first_name: data.first_name,
//                 last_name: data.last_name,
//                 phone: data.phone,
//                 program_type: data.program_type || null,
//                 role: data.role || null,
//             });
//             if (response.ok) {
//                 toast.dismiss();
//                 toast.success("User updated successfully!");
//                 setUsers(
//                     users.map((user) =>
//                         user.id === selectedUser.id ? { ...user, ...response.data } : user
//                     )
//                 );
//                 setIsEditModalOpen(false);
//                 setSelectedUser(null);
//                 reset();
//             } else {
//                 throw new Error(response.data?.message || "Failed to update user");
//             }
//         } catch (error) {
//             toast.dismiss();
//             toast.error(error.message || "Error updating user");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Open delete confirmation modal
//     const openDeleteModal = (user) => {
//         setUserToDelete(user);
//         setIsDeleteModalOpen(true);
//     };

//     // Close modals
//     const closeModals = () => {
//         setIsEditModalOpen(false);
//         setIsDeleteModalOpen(false);
//         setIsPreviewModalOpen(false);
//         setSelectedUser(null);
//         setUserToDelete(null);
//         reset();
//     };

//     // Fetch users on component mount
//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     return (
//         <div className="md:p-6 min-h-screen flex flex-col items-center">
//             <div className="bg-white md:p-6 p-4 rounded-lg shadow-md overflow-x-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-semibold">Users List</h2>
//                     <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-orange-600 transition disabled:opacity-50">
//                         Add User
//                     </button>
//                 </div>

//                 {/* Table Wrapper */}
//                 <div className="relative overflow-auto w-[80vw]">
//                     {loading && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
//                             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
//                         </div>
//                     )}
//                     {users.length === 0 && !loading && (
//                         <div className="text-center py-4 text-gray-500">No users available</div>
//                     )}
//                     <table className="w-full text-sm text-left text-gray-500 border-separate border-spacing-y-3">
//                         <thead className="text-xs text-white uppercase bg-[#242E4C] rounded-2xl">
//                             <tr>
//                                 <th className="px-6 py-7 rounded-s-2xl">ID</th>
//                                 <th className="px-6 py-4">User Name</th>
//                                 <th className="px-6 py-4">Email</th>
//                                 <th className="px-6 py-4">Contact No.</th>
//                                 <th className="px-6 py-4">Program Type</th>
//                                 <th className="px-6 py-4 rounded-e-2xl">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((user) => (
//                                 <tr key={user.id} className="bg-white shadow-md rounded-2xl">
//                                     <td className="px-6 py-4 rounded-s-2xl">{user.id}</td>
//                                     <td className="px-6 py-4 flex items-center space-x-2">
//                                         <img
//                                             src={user.avatar || tableGirl}
//                                             alt="Avatar"
//                                             className="w-10 h-10 rounded-full border"
//                                             onError={(e) => (e.target.src = tableGirl)} // Fallback on image error
//                                         />
//                                         <span className="whitespace-nowrap">
//                                             {user.first_name || "N/A"} {user.last_name || ""}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.email || "N/A"}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.phone || "N/A"}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.program_type || "N/A"}</td>
//                                     <td className="px-6 py-4 flex flex-wrap gap-1 rounded-e-2xl">
//                                         <button
//                                             onClick={() => previewUserDetails(user.id)}
//                                             disabled={loading}
//                                             className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
//                                             title="View Details"
//                                         >
//                                             <img src={tableEye} alt="View" className="w-5 h-5" />
//                                         </button>
//                                         <button
//                                             onClick={() => openEditModal(user)}
//                                             disabled={loading}
//                                             className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
//                                             title="Edit User"
//                                         >
//                                             <img src={pencilIcon} alt="Edit" className="w-5 h-5" />
//                                         </button>
//                                         <button
//                                             onClick={() => openDeleteModal(user)}
//                                             disabled={loading}
//                                             className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px] disabled:opacity-50"
//                                             title="Delete User"
//                                         >
//                                             <img src={trashIcon} alt="Delete" className="w-5 h-5" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                         <tfoot>
//                             <tr className="font-semibold text-gray-900 bg-gray-100">
//                                 <th className="px-6 py-3 text-base rounded-bl-2xl">Total Users</th>
//                                 <td className="px-6 py-3">{users.length}</td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3 rounded-br-2xl"></td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             </div>

//             {/* Edit Modal */}
//             {isEditModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//                         <h3 className="text-xl font-semibold mb-4">Edit User</h3>
//                         <form onSubmit={handleSubmit(updateUser)}>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">First Name</label>
//                                 <input
//                                     {...register("first_name", { required: "First name is required" })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.first_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Last Name</label>
//                                 <input
//                                     {...register("last_name", { required: "Last name is required" })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.last_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Phone</label>
//                                 <input
//                                     {...register("phone", {
//                                         required: "Phone is required",
//                                         pattern: {
//                                             value: /^\+?[1-9]\d{1,14}$/,
//                                             message: "Invalid phone number",
//                                         },
//                                     })}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                                 {errors.phone && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//                                 )}
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Program Type</label>
//                                 <input
//                                     {...register("program_type")}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium">Role</label>
//                                 <input
//                                     {...register("role")}
//                                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={closeModals}
//                                     disabled={loading}
//                                     className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {isDeleteModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//                         <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
//                         <p className="text-gray-600 mb-6">
//                             Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}?
//                         </p>
//                         <div className="flex justify-end gap-2">
//                             <button
//                                 onClick={closeModals}
//                                 disabled={loading}
//                                 className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={deleteUser}
//                                 disabled={loading}
//                                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Preview Modal */}
//             {isPreviewModalOpen && selectedUser && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//                         <h3 className="text-xl font-semibold mb-4">User Details</h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <span className="font-medium">ID:</span> {selectedUser.id}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Name:</span>{" "}
//                                 {selectedUser.first_name || "N/A"} {selectedUser.last_name || ""}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Email:</span> {selectedUser.email || "N/A"}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Phone:</span> {selectedUser.phone || "N/A"}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Program Type:</span>{" "}
//                                 {selectedUser.program_type || "N/A"}
//                             </div>
//                             <div>
//                                 <span className="font-medium">Role:</span> {selectedUser.role || "N/A"}
//                             </div>
//                         </div>
//                         <div className="flex justify-end mt-6">
//                             <button
//                                 onClick={closeModals}
//                                 disabled={loading}
//                                 className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UsersTable;

// import React from "react";
// import tableGirl from '@/assets/nursing/table-girl.png';
// import tableEye from '@/assets/nursing/table-eye.png';
// import pencilIcon from "@/assets/nursing/pencil-black.png";
// import trashIcon from "@/assets/nursing/trash-black.png";

// const users = Array(8).fill({
//     id: 9090,
//     name: "Username",
//     email: "usergmail@gmail.com",
//     contact: "+92 345678901",
//     address: "Texas, United States Of America (USA)",
//     avatar: tableGirl,
// });

// const UsersTable = () => {
//     return (
//         <div className="md:p-6  min-h-screen flex flex-col items-center">
//             <div className=" bg-white md:p-6 p-4 rounded-lg shadow-md overflow-x-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-semibold">Users List</h2>
//                     <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-orange-600 transition">
//                         Add User
//                     </button>
//                 </div>

//                 {/* Table Wrapper (for small screens) */}
//                 <div className="relative overflow-auto  w-[80vw] ">
//                     <table className="w-full text-sm text-left text-gray-500 border-separate border-spacing-y-3">
//                         {/* Fixed Rounded Header */}
//                         <thead className="text-xs text-white uppercase bg-[#242E4C] rounded-2xl">
//                             <tr>
//                                 <th className="px-6 py-7 rounded-s-2xl">ID</th>
//                                 <th className="px-6 py-4">User Name</th>
//                                 <th className="px-6 py-4">Email</th>
//                                 <th className="px-6 py-4">Contact No.</th>
//                                 <th className="px-6 py-4">Address</th>
//                                 <th className="px-6 py-4 rounded-e-2xl">Action</th>
//                             </tr>
//                         </thead>

//                         {/* Table Body with Correct Row Spacing & Rounding */}
//                         <tbody>
//                             {users.map((user, index) => (
//                                 <tr key={index} className="bg-white shadow-md rounded-2xl">
//                                     <td className="px-6 py-4 rounded-s-2xl">{user.id}</td>
//                                     <td className="px-6 py-4 flex items-center space-x-2">
//                                         <img
//                                             src={user.avatar}
//                                             alt="Avatar"
//                                             className="w-10 h-10 rounded-full border"
//                                         />
//                                         <span className="whitespace-nowrap">{user.name}</span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.contact}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{user.address}</td>
//                                     <td className="px-6 py-4 flex flex-wrap gap-1 rounded-e-2xl">
//                                         <button className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px]">
//                                             <img src={tableEye} alt="View" className="w-5 h-5" />
//                                         </button>
//                                         <button className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px]">
//                                             <img src={pencilIcon} alt="Edit" className="w-5 h-5" />
//                                         </button>
//                                         <button className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[40px]">
//                                             <img src={trashIcon} alt="Delete" className="w-5 h-5" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>

//                         {/* Table Footer (Optional) */}
//                         <tfoot>
//                             <tr className="font-semibold text-gray-900 bg-gray-100">
//                                 <th className="px-6 py-3 text-base rounded-bl-2xl">Total Users</th>
//                                 <td className="px-6 py-3">8</td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3"></td>
//                                 <td className="px-6 py-3 rounded-br-2xl"></td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UsersTable;
