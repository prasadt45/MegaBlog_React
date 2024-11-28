import { useEffect, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import authservice from './appwrite/auth';
import { login, logout } from './Store/AuthSlice';
import { Footer, Header } from './Components'; 

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Check if the user is logged in or not
  useEffect(() => {
    authservice
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((err) => {
        console.error("Authentication error:", err);
        dispatch(logout());
      })
      .finally(() => setLoading(false)); // Set loading to false after the check
  }, [dispatch]); // Make sure to add dispatch as a dependency

  // While loading, show the loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <p>Loading...</p>
      </div>
    );
  }

  // After loading, render the main content
  return (
    <div className="w-full block ">
      <Header/> {/* Ensure Headers is a valid component */}
      <main>
        {/* You can uncomment the Outlet if using React Router */}
        {/* <Outlet /> */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
