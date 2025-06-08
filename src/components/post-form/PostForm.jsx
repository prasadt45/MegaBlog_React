import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from ".."; // Ensure Input is corrected as above
import service from "../../appwrite/config.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DotWave = () => (
  <span className="ml-2 flex gap-1 items-center">
    {[...Array(3)].map((_, i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

const typingPhrases = [
  "How to master React hooks ?  ...",
  "Top 10 JavaScript tips and tricks ... ",
  "Building a responsive UI with Tailwind CSS ...",
  "Exploring the new features in ES2023",
  "Understanding the React lifecycle ...",
  "Creating a REST API with Node.js ...",
  "Building a real-time chat app with Socket.io ...",
  "Deploying a React app with Docker ...",
  "Understanding the Virtual DOM ...",
  "Building a custom React hook ...",
  "Optimizing performance in React apps ...",
  "Creating a responsive navbar with React ...",
  "Building a dark mode toggle in React ...",
  "Understanding React context API ...",
  "Building a simple e-commerce app ...",
  "Building a blog with Appwrite ...",
  "Understanding async/await ...",
  "Deploying to Netlify ...",
];

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let typingTimeout;

    function type() {
      const phrase = typingPhrases[currentPhraseIndex];
      if (currentCharIndex <= phrase.length) {
        setPlaceholder(phrase.slice(0, currentCharIndex));
        currentCharIndex++;
        typingTimeout = setTimeout(type, 150);
      } else {
        setTimeout(() => {
          currentCharIndex = 0;
          currentPhraseIndex = (currentPhraseIndex + 1) % typingPhrases.length;
          type();
        }, 1500);
      }
    }

    type();
    return () => clearTimeout(typingTimeout);
  }, []);

  const submit = async (data) => {
    try {
      if (!userData || !userData.$id) {
        toast.error("User not logged in.");
        return;
      }

      setLoading(true);

      const { title, slug, content } = data;
      const userid = userData.$id;
      let featuredImageUrl = post?.featuredImage || "";

      if (data.image && data.image[0]) {
        toast.info(<span>Uploading Image <DotWave /></span>);
        const uploadedUrl = await uploadToCloudinary(data.image[0]);
        if (!uploadedUrl) {
          toast.error("Image upload failed.");
          setLoading(false);
          return;
        }
        featuredImageUrl = uploadedUrl;
        toast.success("Image uploaded!");
      }

      const postData = {
        title,
        slug,
        content,
        featuredImage: featuredImageUrl,
        status: data.status,
        userid,
      };

      let dbPost;
      if (post && post.$id) {
        dbPost = await service.updatePost(post.$id, postData);
        toast.success("Post updated successfully!");
      } else {
        dbPost = await service.createPost(postData);
        toast.success("Post created successfully!");
      }

      if (dbPost) {
        setTimeout(() => navigate(`/post/${dbPost.$id}`), 1000);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const selectedImage = watch("image");

  return (
    <div className="min-h-screen py-10 px-6 rounded-md">
      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-6xl mx-auto backdrop-blur-md bg-white/60 border border-blue-200 rounded-3xl p-10 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 transition-all"
      >
        <div className="md:col-span-2 space-y-6">
          <Input
            label="Blog-Title"
            placeholder={placeholder || ""}
            {...register("title", { required: true })}
            inputClassName="bg-white/90 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 w-full"
          />
          <Input
            label="Slug"
            placeholder="Auto-generated from title"
            {...register("slug", { required: true })}
            inputClassName="bg-white/90 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 w-full"
            onInput={(e) =>
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              })
            }
          />
          <RTE
            label="Content"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>

        <div className="flex flex-col gap-6">
          <Input
            label="Featured Image"
            type="file"
            {...register("image", { required: !post })}
            inputClassName="bg-white/90 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 w-full cursor-pointer"
            accept="image/*"
          />

          {(selectedImage && selectedImage[0]) || post?.featuredImage ? (
            <div className="rounded-xl overflow-hidden shadow-md animate-fadeIn border border-gray-300">
              <img
                src={
                  selectedImage && selectedImage[0]
                    ? URL.createObjectURL(selectedImage[0])
                    : post.featuredImage
                }
                alt="Preview"
                className="w-full object-cover h-48"
              />
            </div>
          ) : null}

          <Select
            label="Status"
            options={["active", "inactive"]}
            {...register("status", { required: true })}
            className="bg-white/90 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 w-full"
          />

          <Button
            type="submit"
            bgColor={post ? "bg-green-500" : "bg-blue-600"}
            className={`text-white font-semibold py-3 rounded-xl transition-all duration-300 ${
              loading
                ? "cursor-not-allowed opacity-70"
                : "hover:scale-105 shadow-md"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                {post ? "Updating" : "Submitting"}
                <DotWave />
              </span>
            ) : post ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </Button>
        </div>
      </form>

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-in-out;
        }
      `}</style>
    </div>
  );
}
