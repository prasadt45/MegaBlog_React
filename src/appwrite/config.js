import conf from '../conf/conf.js';
import { Client, ID, Databases, Permission, Role, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userid }) {
    if (!title || !slug || !content || !userid || !featuredImage) {
      throw new Error("Missing required fields.");
    }
    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      { title, slug, content, featuredImage, status, userid }
    );
  }

  async updatePost(id, { title, content, featuredImage, status, userid }) {
    if (!id || !title || !content || !status || !userid) {
      throw new Error("Missing required fields for update.");
    }
    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id,
      { title, content, featuredImage, status, userid }
    );
  }

  // other methods remain unchanged
  async deletePost(id) {
    try {
      if (!id) throw new Error("ID is required to delete post.");

      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id
      );
      return true;
    } catch (error) {
      console.error("deletePost error:", error);
      return false;
    }
  }

  async getPost(id) {
    try {
      if (!id) throw new Error("ID is required to get post.");

      const post = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id
      );
      return post;
    } catch (error) {
      console.error("getPost error:", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      const posts = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
      return posts;
    } catch (error) {
      console.error("getPosts error:", error);
      return false;
    }
  }

  async uploadFile(file) {
    try {
      if (!file) throw new Error("No file provided for upload.");

      const uploadedFile = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
        [Permission.read(Role.any())] // public read permission
      );
      return uploadedFile;
    } catch (error) {
      console.error("uploadFile error:", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      if (!fileId) throw new Error("fileId is required to delete file.");

      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("deleteFile error:", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    try {
      if (!fileId) throw new Error("fileId is required to get file preview.");
      const filePreview = this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
      return filePreview.href;
    } catch (error) {
      console.error("getFilePreview error:", error);
      return null;
    }
  }
}

const service = new Service();
export default service;
