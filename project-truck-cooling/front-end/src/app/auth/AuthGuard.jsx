import React from 'react';
import { Navigate } from 'react-router-dom';


const AuthGuard = ({ children, requiredRole }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/session/signin" />;
    }

    if (user.role !== requiredRole) {
        return <Navigate to="/session/404" />;
    }

    return children;
};

export default AuthGuard;

