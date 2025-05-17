import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CSSTransition } from "react-transition-group";

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
        toast.success("Post deleted successfully!");
        navigate("/");
      } else {
        toast.error("Failed to delete post.");
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("An error occurred while deleting the post.");
    }
    setLoading(false);
    setShowDeleteConfirm(false);
  };

  if (!post) return null;

  return (
    <div className="py-12 bg-gradient-to-b from-white to-blue-50 min-h-screen flex flex-col items-center">
      <Container>
        <div className="max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-72 object-cover rounded-t-2xl"
            />
          )}

          <div className="p-10">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-8 tracking-wide leading-tight">
              {post.title}
            </h1>

            {isAuthor && (
              <div className="flex space-x-5 mb-10">
                <Link to={`/edit-post/${post.$id}`}>
                  <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-200">
                    ✏️ Edit Post
                  </button>
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-all duration-200"
                >
                  🗑️ Delete Post
                </button>
              </div>
            )}

            <div className="prose max-w-none text-gray-700 prose-blue">
              {parse(post.content)}
            </div>
          </div>
        </div>
      </Container>

      {/* Delete Confirmation Modal */}
      <CSSTransition
        in={showDeleteConfirm}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action is irreversible.
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-semibold"
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
      </CSSTransition>

      {/* Fade animation CSS */}
      <style>{`
        .fade-enter {
          opacity: 0;
          transform: scale(0.9);
        }
        .fade-enter-active {
          opacity: 1;
          transform: scale(1);
          transition: opacity 300ms, transform 300ms;
        }
        .fade-exit {
          opacity: 1;
          transform: scale(1);
        }
        .fade-exit-active {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </div>
  );
}
