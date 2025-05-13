// LogoutBtn.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { logout } from '../../store/authSlice';

function LogoutBtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
    });
  };

  return (
    <button
      onClick={logoutHandler}
      className="px-6 py-2 bg-red-500 text-white font-medium rounded-full transition-all duration-300 ease-in-out hover:bg-red-600"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
