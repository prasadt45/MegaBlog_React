import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import service from "../../appwrite/config.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Cloudinary upload helper
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

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

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

      // If new image selected, upload to Cloudinary
      if (data.image && data.image[0]) {
        toast.info("Uploading image...");
        const uploadedUrl = await uploadToCloudinary(data.image[0]);
        if (!uploadedUrl) {
          toast.error("Failed to upload image.");
          setLoading(false);
          return;
        }
        featuredImageUrl = uploadedUrl;
        toast.success("Image uploaded successfully!");
      }

      console.log("Submitting post with data:", {
        title,
        slug,
        content,
        featuredImageUrl,
        userid,
      });

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
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
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
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-6">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-6"
          {...register("title", { required: true })}
          inputClassName="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-6"
          {...register("slug", { required: true })}
          inputClassName="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          className="mb-6"
        />
      </div>
      <div className="w-1/3 px-2 flex flex-col items-center">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-6 w-full"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
          inputClassName="border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        {(selectedImage && selectedImage[0]) || (post && post.featuredImage) ? (
          <div
            key={post?.featuredImage || "new-image"}
            className="mb-6 w-full rounded-lg overflow-hidden shadow-lg animate-fadeIn"
            style={{ maxHeight: "250px" }}
          >
            <img
              src={
                selectedImage && selectedImage[0]
                  ? URL.createObjectURL(selectedImage[0])
                  : post.featuredImage
              }
              alt={post?.title || "Selected"}
              className="object-cover w-full h-full"
              onLoad={() => URL.revokeObjectURL(selectedImage && selectedImage[0])}
            />
          </div>
        ) : null}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-6 w-full"
          {...register("status", { required: true })}
          selectClassName="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : "bg-indigo-600"}
          className={`w-full flex justify-center items-center ${
            loading ? "cursor-not-allowed opacity-70" : "hover:bg-opacity-90"
          }`}
          disabled={loading}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {post ? (loading ? "Updating..." : "Update") : loading ? "Submitting..." : "Submit"}
        </Button>
      </div>

      {/* Add fade-in animation style */}
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </form>
  );
}
