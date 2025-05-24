import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-300 via-blue-300 to-blue-300 shadow-md backdrop-blur-md sticky top-0 z-50  border-b border-blue-300">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1
          className="text-3xl font-extrabold tracking-wider cursor-pointer drop-shadow-sm bg-gradient-to-r from-blue-900 via-blue-600 to-blue-800 bg-[length:300%_300%] bg-clip-text text-transparent animate-gradient-swim"
          onClick={() => navigate("/")}
        >
          DevBlogs
        </h1>




        <ul className="flex space-x-20 items-center text-blue-800 font-medium text-lg">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="relative group transition duration-300"
                  >
                    <span className="group-hover:text-blue-950 transition">{item.name}</span>
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </button>
                </li>
              )
          )}
          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
