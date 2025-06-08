import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
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
    } catch {
      toast.error("An error occurred while deleting the post.");
    }
    setLoading(false);
    setShowDeleteConfirm(false);
  };

  if (!post) return null;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-gradient-to-tr from-blue-300 via-blue-200 to-blue-400 animate-bgShift">
        <Container>
          <div className="max-w-4xl bg-white backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl overflow-hidden mx-auto hover:shadow-[0_25px_50px_rgba(59,130,246,0.4)] transition-shadow duration-400">
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-30 bg-gradient-to-tr from-blue-300 via-blue-200 to-blue-100"
                loading="lazy"
                style={{ backgroundColor: "white" }}
              />
            )}

            <div className="p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 tracking-tight leading-tight">
                {post.title}
              </h1>

              {isAuthor && (
                <div className="flex space-x-4 mb-10 justify-left">
                  <Link to={`/edit-post/${post.$id}`}>
                    <button className="px-8 py-2 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition transform active:scale-95 duration-200">
                      Edit Post
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-8 py-2 rounded-full bg-red-700 text-white font-semibold shadow hover:bg-red-800 transition transform active:scale-95 duration-200"
                  >
                    Delete Post
                  </button>
                </div>
              )}

              <div className="prose max-w-none text-gray-900 prose-blue">
                {parse(post.content)}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <CSSTransition
        in={showDeleteConfirm}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-10 text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-6">
              Confirm Deletion
            </h2>
            <p className="text-gray-800 mb-10 text-lg font-medium">
              Are you sure you want to delete this post? This action is irreversible.
            </p>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-8 py-3 rounded-full bg-gray-300 text-gray-900 hover:bg-gray-400 font-semibold transition duration-200 shadow"
              >
                Cancel
              </button>
              <button
                onClick={deletePost}
                disabled={loading}
                className={`px-8 py-3 rounded-full font-semibold transition duration-200 shadow ${
                  loading
                    ? "bg-red-400 cursor-not-allowed text-white"
                    : "bg-red-700 hover:bg-red-800 text-white"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>

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

        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bgShift {
          background-size: 300% 300%;
          animation: bgShift 25s ease infinite;
        }
        .prose a {
          color: #2563eb;
          text-decoration: underline;
          transition: color 0.3s;
        }
        .prose a:hover {
          color: #1e40af;
        }
      `}</style>
    </>
  );
}
