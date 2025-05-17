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
  const [showCursor, setShowCursor] = useState(true);
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

    // Hide cursor after typing
    const timer = setTimeout(() => setShowCursor(false), 3000);
    return () => clearTimeout(timer);
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
    'bg-gradient-to-r from-blue-600 to-blue-400',
    'bg-gradient-to-r from-purple-600 to-purple-400',
    'bg-gradient-to-r from-red-600 to-red-400',
    'bg-gradient-to-r from-teal-600 to-teal-400',
    'bg-gradient-to-r from-pink-600 to-pink-400',
    'bg-gradient-to-r from-orange-600 to-orange-400',
  ];

  if (!isLoggedIn) {
    return (
      <div className="w-full py-20 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <Container>
          <h1
            className="text-3xl font-extrabold cursor-pointer hover:text-blue-300 transition-colors flex justify-center items-center gap-1"
            onClick={() => navigate('/login')}
          >
            <span className="whitespace-nowrap overflow-hidden inline-block animate-typing border-r-0">
              Please Login to View Posts
            </span>
            {showCursor && (
              <span className="text-white text-3xl font-normal animate-blink">|</span>
            )}
          </h1>
        </Container>
      </div>
    );
  }

  const displayedPosts = posts.slice(0, 9);

  return (
    <div className="min-h-screen bg-indigo-50 text-gray-900 py-12">
      <Container>
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-semibold text-indigo-700">No posts available</h2>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPosts.map((post, index) => (
                <div
                  key={post.$id}
                  className="relative rounded-2xl shadow-md overflow-hidden border border-indigo-200 bg-white cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ maxHeight: '320px' }}
                >
                  <div
                    onClick={() => navigate(`/post/${post.$id}`)}
                    className="flex flex-col h-full"
                  >
                    <div
                      className={`relative h-40 ${bgColors[index % bgColors.length]} overflow-hidden rounded-t-2xl`}
                    >
                      <img
                        src={post.featuredImage}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-transparent to-transparent opacity-60"></div>
                      <h3 className="absolute bottom-3 left-3 right-3 text-white text-lg font-semibold truncate drop-shadow-md">
                        {post.title}
                      </h3>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <p className="text-gray-700 text-xs line-clamp-3 mb-3">
                        {post.content ? post.content.replace(/<[^>]+>/g, '') : 'No content available.'}
                      </p>
                      <span
                        className="self-start text-indigo-600 font-semibold cursor-pointer hover:underline select-none text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/post/${post.$id}`);
                        }}
                      >
                        Read more →
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.$id);
                    }}
                    className={classNames(
                      'absolute bottom-4 right-4 text-2xl transition-transform duration-300 ease-in-out select-none',
                      likedPosts[post.$id]
                        ? 'text-indigo-600 scale-110 animate-pulse'
                        : 'text-gray-400 hover:text-indigo-500'
                    )}
                    aria-label={likedPosts[post.$id] ? 'Unlike post' : 'Like post'}
                  >
                    <FaThumbsUp />
                  </button>
                </div>
              ))}
            </div>

            {posts.length > 9 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => navigate('/all-posts')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Read All Posts
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default Home;
