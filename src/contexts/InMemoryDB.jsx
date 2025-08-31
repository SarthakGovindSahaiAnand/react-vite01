// InMemoryDB.js
// Simple in-memory + localStorage database
const InMemoryDB = {
  users: [],
  blogs: [],
  admin: [],
  disabled: [],

  // ----- INIT -----
  load() {
    try {
      const data = JSON.parse(localStorage.getItem("InMemoryDB"));
      if (data) {
        this.users = data.users || [];
        this.blogs = data.blogs || [];
        this.admin = data.admin || [];
        this.disabled = data.disabled || [];
      }
    } catch (e) {
      console.error("Failed to load DB:", e);
    }
  },

  save() {
    localStorage.setItem(
      "InMemoryDB",
      JSON.stringify({
        users: this.users,
        blogs: this.blogs,
        admin: this.admin,
        disabled: this.disabled,
      })
    );
  },

  // ----- USER FUNCTIONS -----
  getUser(uid) {
    return this.users.find((u) => u.uid === uid);
  },

  saveUser(user) {
    const index = this.users.findIndex((u) => u.uid === user.uid);
    if (index === -1) {
      this.users.push(user); // new user
    } else {
      this.users[index] = user; // update existing
    }
    this.save(); // persist to localStorage
    return user;
  },

  getUserByEmail(email) {
    return this.users.find((u) => u.email === email);
  },

  createUser(email, password, role = "user") {
    const newUser = {
      uid: Date.now().toString(),
      email,
      password,
      role,
    };
    this.users.push(newUser);
    this.save();
    return { user: newUser }; // mimic Firebase
  },

  // ----- BLOG FUNCTIONS -----
  addBlog(title, subHeading, bodyContent, userId, postedByEmail, datePosted) {
    const blog = {
      id: Date.now().toString(),
      title,
      subHeading,
      content: bodyContent,
      userId,
      postedByEmail,
      datePosted,
      createdAt: new Date(),
    };
    this.blogs.push(blog);
    this.save();
    return blog;
  },

  editBlog(id, title, subHeading, bodyContent, userId) {
    const blog = this.blogs.find((b) => b.id === id && b.userId === userId);
    if (!blog) throw new Error("Blog not found or not authorized");
    blog.title = title;
    blog.subHeading = subHeading;
    blog.content = bodyContent;
    this.save();
    return blog;
  },

  deleteBlog(id, userId, isAdmin = false) {
    const index = this.blogs.findIndex(
      (b) => b.id === id && (b.userId === userId || isAdmin)
    );
    if (index === -1) throw new Error("Blog not found or not authorized");
    this.blogs.splice(index, 1);
    this.save();
    return true;
  },

  listBlogs() {
    return this.blogs;
  },

  BlogDataService() {
    console.log("hii");
  },
};

// load data immediately on import
InMemoryDB.load();

export default InMemoryDB;
