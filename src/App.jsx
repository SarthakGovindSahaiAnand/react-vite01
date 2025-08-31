import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import UpdateProfile from './components/UpdateProfile';
import PrivateRoute from './components/PrivateRoute'; // Ensure your PrivateRoute is updated as discussed
import ForgotPassword from './components/ForgotPassword';
import CreatePost from './components/CreatePost';
import ViewBlog from './components/ViewBlog';
import Profile from './components/Profile';
import Wait from './components/Wait';
import EditBlog from './components/EditBlog';
import EditUser from './components/EditUser';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import AuthProvider from './contexts/AuthContext';


function App() {
  return (
    <Container>
      <Router>
        <AuthProvider>
            <Routes>
              {/* Public Routes */}
              
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/wait" element={<Wait />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/blog/:blogId" element={<ViewBlog />} />
              <Route path="/admin-login" element={<AdminLogin />} /> {/* Assuming AdminLogin is public */}

              {/* Protected Routes using PrivateRoute as a wrapper */}
              <Route element={<PrivateRoute />}>
                  {/* These routes will only be accessible if the user is authenticated */}
                  <Route path="/" element={<Home />} /> 
                  <Route path="/update-profile" element={<UpdateProfile />} />
                  <Route path="/myBlogs" element={<Profile />} />
                  <Route path="/edit-blog/:blogId" element={<EditBlog />} /> {/* Note the colon for params */}
                  <Route path="/edit-user/:uid" element={<EditUser />} />     {/* Note the colon for params */}
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/admin" element={<Admin />} />
              </Route>

              {/* Catch-all for Not Found pages */}
              <Route path="*" element={<div>404 Not Found</div>} /> {/* You can replace this with your actual NotFound component */}
            </Routes>
          </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;

const Container = styled.div`
  /* Your styles here */
`;