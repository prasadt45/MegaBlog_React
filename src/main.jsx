import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {  RouterProvider , createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './Store/Store.js'; // Ensure the store is correctly exported
import Home from './Pages/Home.jsx';
import { AuthLayout , Login } from './Components/index.js';
import Post from './Pages/Post.jsx';
import Addpost from './Pages/Addpost.jsx';
import Editpost from './Pages/Editpost.jsx';
import Signup from './Pages/Signup.jsx';
import AllPost from './Pages/AllPost.jsx';


const router = createBrowserRouter([
  {
    path:'/' , 
    element : <App /> , 
    children:[
      {
        path:'/' ,
        element : <Home/> , 

      } ,
      {
        path:'/login' ,
        element:(
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ) , 

      },
      {
        path: "/signup",
        element: (
            <AuthLayout authentication={false}>
                <Signup/>
            </AuthLayout>
        ),
    },
    {
        path: "/all-posts",
        element: (
            <AuthLayout authentication>
                {" "}
                <AllPost/>
            </AuthLayout>
        ),
    },
    {
        path: "/add-post",
        element: (
            <AuthLayout authentication>
                {" "}
                <Addpost/>
            </AuthLayout>
        ),
    },
    {
        path: "/edit-post/:slug",
        element: (
            <AuthLayout authentication>
                {" "}
                <Editpost />
            </AuthLayout>
        ),
    },
    {
        path: "/post/:slug",
        element: <Post />,
    },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
