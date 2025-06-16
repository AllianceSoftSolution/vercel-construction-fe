import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const AddUserModal = ({ isOpen, onClose, onAddUser, loading }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();




    const onSubmit = async (data) => {
        const result = await onAddUser(data);
        // If creation was successful, reset the form
        if (result?.success || result === true) {
            reset();
            onClose(); // optional: close the modal too
        }
    };
    useEffect(() => {
        if (!isOpen) {
            reset(); // Clear form values when modal is closed
        }
    }, [isOpen, reset]);


    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-semibold mb-4">Add New User</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">First Name</label>
                        <input
                            {...register("first_name", { required: "First name is required" })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            disabled={loading}
                        />
                        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Last Name</label>
                        <input
                            {...register("last_name", { required: "Last name is required" })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            disabled={loading}
                        />
                        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                            })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            disabled={loading}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            disabled={loading}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Phone</label>
                        <input
                            {...register("phone", {
                                required: "Phone is required",
                                pattern: { value: /^\+?[1-9]\d{1,14}$/, message: "Invalid phone number" },
                            })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            disabled={loading}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Program Type</label>
                        <input
                            {...register("program_type")}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                reset(); // optional: reset when cancelling
                                onClose();
                            }}
                            disabled={loading}
                            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;



// import React from "react";
// import { useForm } from "react-hook-form";

// const AddUserModal = ({ isOpen, onClose, onAddUser, loading }) => {
//     const { register, handleSubmit, formState: { errors } } = useForm();

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
//                 <h3 className="text-xl font-semibold mb-4">Add New User</h3>
//                 <form onSubmit={handleSubmit(onAddUser)}>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">First Name</label>
//                         <input
//                             {...register("first_name", { required: "First name is required" })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Last Name</label>
//                         <input
//                             {...register("last_name", { required: "Last name is required" })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Email</label>
//                         <input
//                             {...register("email", {
//                                 required: "Email is required",
//                                 pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
//                             })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Password</label>
//                         <input
//                             type="password"
//                             {...register("password", { required: "Password is required" })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Phone</label>
//                         <input
//                             {...register("phone", {
//                                 required: "Phone is required",
//                                 pattern: { value: /^\+?[1-9]\d{1,14}$/, message: "Invalid phone number" },
//                             })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Program Type</label>
//                         <input
//                             {...register("program_type")}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                     </div>
//                     <div className="flex justify-end gap-2">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             disabled={loading}
//                             className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
//                         >
//                             Add User
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddUserModal;
// import React from "react";
// import { useForm } from "react-hook-form";

// const AddUserModal = ({ isOpen, onClose, onAddUser, loading }) => {
//     const { register, handleSubmit, formState: { errors } } = useForm();

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
//                 <h3 className="text-xl font-semibold mb-4">Add New User</h3>
//                 <form onSubmit={handleSubmit(onAddUser)}>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">First Name</label>
//                         <input
//                             {...register("first_name", { required: "First name is required" })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Last Name</label>
//                         <input
//                             {...register("last_name", { required: "Last name is required" })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Email</label>
//                         <input
//                             {...register("email", {
//                                 required: "Email is required",
//                                 pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
//                             })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Phone</label>
//                         <input
//                             {...register("phone", {
//                                 required: "Phone is required",
//                                 pattern: { value: /^\+?[1-9]\d{1,14}$/, message: "Invalid phone number" },
//                             })}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                         {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium">Program Type</label>
//                         <input
//                             {...register("program_type")}
//                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                             disabled={loading}
//                         />
//                     </div>
//                     <div className="flex justify-end gap-2">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             disabled={loading}
//                             className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
//                         >
//                             Add User
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddUserModal;