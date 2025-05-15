import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import authService from '../appwrite/auth';
import { Container } from '../components';
import { FaThumbsUp } from 'react-icons/fa'; 
import classNames from 'classnames';

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      const user = await authService.getCurrentUser();
      setIsLoggedIn(!!user);

      if (user) {
        const fetchedPosts = await appwriteService.getPosts();
        if (fetchedPosts) {
          setPosts(fetchedPosts.documents);
        }
      }
    };

    checkAuthAndFetchPosts();
  }, []);

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const bgColors = [
    'bg-gradient-to-r from-indigo-500 to-purple-500',
    'bg-gradient-to-r from-pink-500 to-red-500',
    'bg-gradient-to-r from-green-500 to-teal-400',
    'bg-gradient-to-r from-yellow-500 to-orange-400',
    'bg-gradient-to-r from-blue-600 to-blue-400'
  ];

  if (!isLoggedIn) {
    return (
      <div className="w-full py-8 mt-4 text-center bg-gradient-to-r  text-white bg-white">
        <Container>
          <h1
            className="text-2xl font-bold cursor-pointer hover:text-blue-100"
            onClick={() => navigate('/login')}
          >
            Login to read posts
          </h1>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-slate-200 to-gray-100 text-gray-800">
      <Container>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">No posts available</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
            {posts.map((post, index) => (
              <div
                key={post.$id}
                className="relative shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-transform transform hover:scale-105"
              >
                {/* Make whole card clickable */}
                <div onClick={() => navigate(`/post/${post.$id}`)} className="cursor-pointer">
                  {/* Top section */}
                  <div className={`flex items-center gap-4 p-4 ${bgColors[index % bgColors.length]}`}>
                    <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{post.title}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6">
                    <p className="text-sm text-gray-700">{post.content}</p>
                  </div>
                </div>

                {/* Like Button (bottom right corner) */}
                <button
                  onClick={() => handleLike(post.$id)}
                  className={classNames(
                    'absolute bottom-4 right-4 text-xl transition-transform duration-300 ease-in-out',
                    likedPosts[post.$id] ? 'text-blue-500 scale-125' : 'text-gray-400 hover:text-blue-400'
                  )}
                >
                  <FaThumbsUp />
                </button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;
