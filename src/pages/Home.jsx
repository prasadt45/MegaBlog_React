import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import authService from '../appwrite/auth';
import { Container, PostCard } from '../components';

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  if (!isLoggedIn) {
    return (
      <div className="w-full py-8 mt-4 text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
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
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Posts */}
      <Container>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">No posts available</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
            {posts.map((post) => (
              <div key={post.$id} className="transition transform hover:scale-105">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;
