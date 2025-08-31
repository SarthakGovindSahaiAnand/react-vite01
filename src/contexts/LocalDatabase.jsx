// src/contexts/LocalDatabase.jsx
import InMemoryDB from "./InMemoryDB";
import Storage from "../utils/Storage";

const LocalDatabase = {
  // Persist everything from memory to localStorage
  save() {
    Storage.set("users", InMemoryDB.users);
    Storage.set("blogs", InMemoryDB.blogs);
    Storage.set("admin", InMemoryDB.admin);
    Storage.set("disabled", InMemoryDB.disabled);
  },

  // Load everything from localStorage into memory
  load() {
    InMemoryDB.users   = Storage.get("users", []);
    InMemoryDB.blogs   = Storage.get("blogs", []);
    InMemoryDB.admin   = Storage.get("admin", []);
    InMemoryDB.disabled= Storage.get("disabled", []);
  },

  clear() {
    InMemoryDB.users = [];
    InMemoryDB.blogs = [];
    InMemoryDB.admin = [];
    InMemoryDB.disabled = [];
    Storage.remove("users");
    Storage.remove("blogs");
    Storage.remove("admin");
    Storage.remove("disabled");
  },

  // ---------- BLOGS ----------
  getBlogs() {
    this.load();
    return [...InMemoryDB.blogs];
  },

  getBlogsByUser(userId) {
    this.load();
    return InMemoryDB.blogs.filter((b) => b.userId === userId);
  },

  saveBlog(blog) {
    this.load();
    const index = InMemoryDB.blogs.findIndex((b) => b.id === blog.id);
    if (index === -1) {f
      InMemoryDB.blogs.push(blog);
    } else {
      InMemoryDB.blogs[index] = blog;
    }
    this.save();
    return blog;
  },

  updateBlog(id, patch) {
    this.load();
    const index = InMemoryDB.blogs.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Blog not found");
    InMemoryDB.blogs[index] = { ...InMemoryDB.blogs[index], ...patch };
    this.save();
    return InMemoryDB.blogs[index];
  },

  deleteBlog(id) {
    this.load();
    const before = InMemoryDB.blogs.length;
    InMemoryDB.blogs = InMemoryDB.blogs.filter((b) => b.id !== id);
    this.save();
    return before !== InMemoryDB.blogs.length;
  },

  updateBlogsByUser(userId, patch) {
    this.load();
    InMemoryDB.blogs = InMemoryDB.blogs.map((b) =>
      b.userId === userId ? { ...b, ...patch } : b
    );
    this.save();
  },

  // ---------- USERS ----------
  getUsers() {
    this.load();
    return [...InMemoryDB.users];
  },

  getUser(userId) {
    this.load();
    return InMemoryDB.users.find((u) => u.uid === userId) || null;
  },

  saveUser(userId, data) {
    this.load();
    const index = InMemoryDB.users.findIndex((u) => u.uid === userId);
    if (index === -1) {
      InMemoryDB.users.push({ uid: userId, ...data });
    } else {
      InMemoryDB.users[index] = { ...InMemoryDB.users[index], ...data };
    }
    this.save();
    return this.getUser(userId);
  },

  // ---------- ADMIN ----------
  getAdmins() {
    this.load();
    return [...InMemoryDB.admin];
  },

  isAdmin(userId) {
    this.load();
    return InMemoryDB.admin.some((a) => a.uid === userId);
  },

  setAdmin(userId, email, active) {
    this.load();
    if (active) {
      if (!this.isAdmin(userId)) {
        InMemoryDB.admin.push({ uid: userId, email, isAdmin: true });
      }
    } else {
      InMemoryDB.admin = InMemoryDB.admin.filter((a) => a.uid !== userId);
    }
    this.save();
  },

  // ---------- DISABLED ----------
  getDisabledUsers() {
    this.load();
    return [...InMemoryDB.disabled];
  },

  isDisabled(userId) {
    this.load();
    return InMemoryDB.disabled.some((d) => d.uid === userId);
  },

  setDisabled(userId, email, active) {
    this.load();
    if (active) {
      if (!this.isDisabled(userId)) {
        InMemoryDB.disabled.push({ uid: userId, email, isDisabled: true });
      }
    } else {
      InMemoryDB.disabled = InMemoryDB.disabled.filter((d) => d.uid !== userId);
    }
    this.save();
  },
};

export default LocalDatabase;
