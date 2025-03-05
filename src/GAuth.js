import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "640719651317-0v36rsmh7tup3k7t6kedq20kiepmuqb9.apps.googleusercontent.com";

const GAuth = () => {
    const onSuccess = async (response) => {
           
        try {
          const res = await fetch("http://localhost:8080/auth/google/callback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: response }),
          });
      
          const data = await res.json();
          if (data.token) {
            localStorage.setItem("token", data.token);
            const user = JSON.parse(atob(data.token.split('.')[1]));
            if (user.role === 0) {
              window.location.href = `/leave-approval`;
            }
            else {
              window.location.href = `/leave-request`;
            }
          } else {
            console.log("Error logging in:", data);
          }
        } catch (error) {
          console.log("Google login error:", error);
        }
      };
      

  const onError = () => {
    alert("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin onSuccess={onSuccess} onError={onError} flow="auth-code" />
    </GoogleOAuthProvider>
  );
};

export default GAuth;
