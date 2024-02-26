import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import Home from "./Home";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import ConfirmSignUp from "./Auth/ConfirmSignUp";
import Profile from "./Auth/UserProfile";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import RouteGuard from "./RouteGuard";
import PublicPageExample from "./PublicPageExample";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container">
          <div className="grid grid-cols-8 m-5 items-center text-center divide-x divide-amber-400 border-2 border-amber-400">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/public-page">Public Page</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/forgot-password">Forgot Password</Link>
            <Link to="/reset-password">Reset Password</Link>
            <Link to="/confirm-sign-up">Confirm Sign Up</Link>
          </div>
          <main>
            <div className="m-12">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/public-page" element={<PublicPageExample/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/confirm-sign-up" element={<ConfirmSignUp/>}/>

                <Route
                    path="/profile"
                    element={
                      <RouteGuard>
                        <Profile/>
                      </RouteGuard>
                    }
                />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
