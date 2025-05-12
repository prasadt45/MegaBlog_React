import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Correct navigation usage
import appwriteService from '../appwrite/config';
import authService from '../appwrite/auth';
import { Container, PostCard } from '../components';

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      const user = await authService.getCurrentUser();
      setIsLoggedIn(!!user); // Check if user is logged in

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
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1
                className="text-2xl font-bold hover:text-gray-500 cursor-pointer"
                onClick={() => navigate('/login')} // Proper navigation
              >
                Login to read posts
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                No posts available
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
