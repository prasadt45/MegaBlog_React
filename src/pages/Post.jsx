import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userid === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = async () => {
    setLoading(true);
    try {
      const status = await appwriteService.deletePost(post.$id);
      if (status) {
        // Optional: Delete image from Cloudinary separately if needed
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
    setLoading(false);
    setShowDeleteConfirm(false);
  };

  if (!post) return null;

  return (
    <div className="py-10 bg-gray-50 min-h-screen flex flex-col items-center">
      <Container>
        <div className="max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">{post.title}</h1>

            {isAuthor && (
              <div className="flex space-x-4 mb-8">
                <Link to={`/edit-post/${post.$id}`}>
                  <button
                    type="button"
                    className="px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
                  >
                    Edit Post
                  </button>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-5 py-2 rounded-md bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition"
                >
                  Delete Post
                </button>
              </div>
            )}

            <div className="prose prose-indigo max-w-none">{parse(post.content)}</div>
          </div>
        </div>
      </Container>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-6 text-center">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={deletePost}
                disabled={loading}
                className={`px-6 py-2 rounded-md text-white font-semibold transition ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
