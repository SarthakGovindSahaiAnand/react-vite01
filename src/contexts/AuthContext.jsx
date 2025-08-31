import React, { createContext, useContext, useState, useEffect } from "react";
import InMemoryDB from "./InMemoryDB";
import LocalDatabase from "./LocalDatabase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Load data from localStorage into memory once at startup
  useEffect(() => {
    LocalDatabase.load();

    // Restore currentUser from localStorage if it exists
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false); // Set loading to false after attempting to load user
  }, []);

  const signup = (email, password, role = "user") => {
    LocalDatabase.load();

    const exists = InMemoryDB.getUserByEmail(email);
    if (exists) throw new Error("User already exists");

    const newUser = InMemoryDB.createUser(email, password, role);
    setCurrentUser(newUser);
    LocalDatabase.save();

    // Persist currentUser
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    return newUser;
  };

  const login = (email, password) => {
    LocalDatabase.load();

    const user = InMemoryDB.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) throw new Error("Invalid email or password");

    setCurrentUser(user);

    // Persist currentUser
    localStorage.setItem("currentUser", JSON.stringify(user));

    console.log("AuthContext: Current user after login:", user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    console.log("AuthContext: User logged out.");
  };

  const createBlog = (title, subHeading, bodyContent) => {
    if (!currentUser) throw new Error("Not logged in");
    if (currentUser.role !== "admin") throw new Error("Unauthorized: Only admins can create blogs");
    const datePosted = new Date().toISOString().split('T')[0]; // Generate current date
    const blog = InMemoryDB.addBlog(title, subHeading, bodyContent, currentUser.uid, currentUser.email, datePosted);
    LocalDatabase.save();
    return blog;
  };

  const editBlog = (id, title, subHeading, bodyContent) => {
    if (!currentUser) throw new Error("Not logged in");
    if (currentUser.role !== "admin") throw new Error("Unauthorized: Only admins can edit blogs");
    const blog = InMemoryDB.editBlog(id, title, subHeading, bodyContent, currentUser.uid);
    LocalDatabase.save();
    return blog;
  };

  const deleteBlog = (id) => {
    if (!currentUser) throw new Error("Not logged in");
    if (currentUser.role !== "admin") throw new Error("Unauthorized: Only admins can delete blogs");
    const isAdmin = currentUser.role === "admin";
    const result = InMemoryDB.deleteBlog(id, currentUser.uid, isAdmin);
    LocalDatabase.save();
    return result;
  };

  const getBlogById = (id) => {
    LocalDatabase.load();
    return InMemoryDB.blogs.find(blog => blog.id === id);
  };

  const listBlogs = () => {
    LocalDatabase.load();
    return InMemoryDB.listBlogs();
  };

  const listUsers = () => {
    LocalDatabase.load();
    return LocalDatabase.getUsers();
  };

  const updateUserRole = (uid, role) => {
    LocalDatabase.load();
    const user = LocalDatabase.getUser(uid);
    if (!user) throw new Error("User not found");
    LocalDatabase.setAdmin(uid, user.email, role === "admin");
    user.role = role; // Update role in user object
    LocalDatabase.saveUser(uid, { role: role }); // Persist the updated role
    return LocalDatabase.getUser(uid); // Return updated user
  };

  const updateUserStatus = (uid, isDisabled) => {
    LocalDatabase.load();
    const user = LocalDatabase.getUser(uid);
    if (!user) throw new Error("User not found");
    LocalDatabase.setDisabled(uid, user.email, isDisabled);
    user.isDisabled = isDisabled; // Update isDisabled in user object
    LocalDatabase.saveUser(uid, { isDisabled: isDisabled }); // Persist the updated status
    return LocalDatabase.getUser(uid);
  };

  const resetPassword = (email) => {
    // In a local storage context, password reset is not directly supported.
    // We'll simulate a success or inform the user.
    console.log(`Password reset requested for ${email}. (Simulated: Check your inbox)`);
    return Promise.resolve(); // Simulate async operation
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout,
        createBlog,
        editBlog,
        deleteBlog,
        getBlogById,
        listBlogs,
        listUsers,
        updateUserRole,
        updateUserStatus,
        resetPassword,
        loading,
        isAdmin: currentUser && currentUser.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
