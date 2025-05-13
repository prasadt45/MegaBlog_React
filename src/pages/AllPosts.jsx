import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components';
import appwriteService from '../appwrite/config';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);

        // Initialize like counts (fake/mock values for now)
        const counts = {};
        posts.documents.forEach((post) => {
          counts[post.$id] = Math.floor(Math.random() * 100); // simulate initial likes
        });
        setLikeCounts(counts);
      }
    });
  }, []);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    setLikeCounts((prev) => ({
      ...prev,
      [postId]: likedPosts[postId] ? prev[postId] - 1 : prev[postId] + 1,
    }));
  };

  return (
    <div className="w-full py-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <Container>
        <div className="flex flex-wrap -mx-2">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transform transition-transform duration-300 hover:scale-105"
            >
              <div
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer relative group"
                onClick={() => navigate(`/post/${post.$id}`)}
              >
                {/* Top Section */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover"
                  />
                  <h3 className="text-lg font-bold truncate ml-4">{post.title}</h3>
                </div>

                {/* Bottom Content */}
                <div className="p-4">
                  <p className="text-sm text-gray-700 line-clamp-3">{post.excerpt}</p>
                </div>

                {/* Like Button with Count and Animation */}
                <div
                  className={`absolute bottom-4 right-4 text-red-500 text-xl z-10 transition-transform ${
                    likedPosts[post.$id] ? 'scale-125' : 'scale-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating to post
                    toggleLike(post.$id);
                  }}
                >
                  {likedPosts[post.$id] ? (
                    <FaHeart className="animate-ping-once" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <div className="text-sm text-gray-600 text-center">{likeCounts[post.$id] || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
