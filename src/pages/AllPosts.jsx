import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components';
import appwriteService from '../appwrite/config';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const navigate = useNavigate();

  const animationRefs = useRef({});

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);

        const counts = {};
        posts.documents.forEach((post) => {
          counts[post.$id] = 121 + Math.floor(Math.random() * 100);
        });

        Object.entries(counts).forEach(([postId, targetCount]) => {
          animateCount(postId, targetCount);
        });
      }
    });

    return () => {
      Object.values(animationRefs.current).forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  const animateCount = (postId, targetCount) => {
    let start = 0;
    const duration = 1000; 
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const currentCount = Math.floor(progress * targetCount);
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: currentCount,
        }));
        animationRefs.current[postId] = requestAnimationFrame(step);
      } else {
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: targetCount,
        }));
        cancelAnimationFrame(animationRefs.current[postId]);
      }
    };

    animationRefs.current[postId] = requestAnimationFrame(step);
  };

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
    <div className="w-full min-h-screen py-10 bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <Container>
        <h2 className="text-4xl font-extrabold text-indigo-800 mb-10 text-center tracking-wide">
          Latest Posts
        </h2>
        <div className="flex flex-wrap -mx-3">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="p-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <div
                className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer group transform transition duration-300 hover:shadow-2xl hover:-translate-y-2 relative"
                onClick={() => navigate(`/post/${post.$id}`)}
              >
                {/* Image Section */}
                <div className="relative h-40 overflow-hidden rounded-t-3xl">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-transparent to-transparent opacity-60"></div>
                  <h3 className="absolute bottom-4 left-4 right-4 text-white text-xl font-semibold truncate drop-shadow-lg">
                    {post.title}
                  </h3>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between h-48 overflow-y-auto">
                  <p className="text-gray-700 text-xs line-clamp-3 mb-3">
                    {post.content ? post.content.replace(/<[^>]+>/g, '') : 'No content available.'}
                  </p>

                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/post/${post.$id}`);
                    }}
                    className="inline-block self-start text-indigo-600 font-semibold text-sm cursor-pointer hover:underline"
                  >
                    Read more →
                  </span>
                </div>

                {/* Like Button */}
                <div
                  className={`absolute bottom-5 right-5 flex flex-col items-center text-red-500 text-2xl z-10 select-none transition-transform duration-300 ${likedPosts[post.$id] ? "scale-125" : "scale-100"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(post.$id);
                  }}
                >
                  {likedPosts[post.$id] ? (
                    <FaHeart className="animate-pulse text-red-600" />
                  ) : (
                    <FaRegHeart className="text-red-400 hover:text-red-600 transition-colors" />
                  )}
                  <span className="text-sm text-gray-700 mt-1 font-medium select-text">
                    {likeCounts[post.$id] || 0}
                  </span>
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
