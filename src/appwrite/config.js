import conf from '../conf/conf.js';
import { Client, ID, Databases , Permission , Role, Storage, Query } from "appwrite";

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

    // Create a post
// Create a post
async createPost({ title, slug, content, featuredImage, status, userid }) {
    try {
        console.log("Creating post with featured image:", featuredImage); // Check the value of featuredImage

        // Validate required fields
        if (!title || !slug || !content || !userid || !featuredImage) {
            console.error("Missing required fields:", { title, slug, content, featuredImage, userid });
            throw new Error("Missing required fields.");
        }

        const postData = {
            title,
            slug,
            content,
            featuredImage,
            status,
            userid, // Ensure userId is passed here
        };

        const response = await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            postData
        );
        return response;
    } catch (error) {
        console.error("Appwrite service :: createPost :: error", error);
        throw error;
    }
}


// Update an existing post by ID
async updatePost(id, { title, content, featuredImage, status, userid }) {
    try {
        // Validate required fields
        if (!id || !title || !content || !status || !userid) {
            console.error("Missing required fields for update:", { id, title, content, status, userid });
            throw new Error("Missing required fields for update.");
        }

        const response = await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            id,  // Use the document ID for update
            {
                title,
                content,
                featuredImage,
                status,
                userid,  // Ensure userId is passed here
            }
        );
        return response;
    } catch (error) {
        console.error("Appwrite service :: updatePost :: error", error);
        throw error;
    }
}


    // Delete a post by ID
    async deletePost(id) {
        try {
            if (!id) {
                console.error("Missing ID for deletion.");
                throw new Error("ID is required to delete post.");
            }

            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                id
            );
            return true;
        } catch (error) {
            console.error("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // Get a single post by ID
    async getPost(id) {
        try {
            if (!id) {
                console.error("Missing ID for fetching post.");
                throw new Error("ID is required to get post.");
            }

            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                id
            );
        } catch (error) {
            console.error("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    // Get multiple posts with optional filters (e.g., by status)
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // File upload service
   
async uploadFile(file) {
    try {
        if (!file) {
            console.error("No file provided for upload.");
            throw new Error("No file provided for upload.");
        }

        return await this.bucket.createFile(
            conf.appwriteBucketId,
            ID.unique(),
            file,
            [Permission.read(Role.any())] // ✅ Public read permission
        );
    } catch (error) {
        console.error("Appwrite service :: uploadFile :: error", error);
        return false;
    }
}

    // Delete a file by fileId
    async deleteFile(fileId) {
        try {
            if (!fileId) {
                console.error("Missing fileId for deletion.");
                throw new Error("fileId is required to delete file.");
            }

            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // Get file preview by fileId
    getFilePreview(fileId) {
        if (!fileId) {
            console.error("Missing fileId for preview.");
            throw new Error("fileId is required to get file preview.");
        }
    
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId).href; // ✅ Use .href
    }
    
    
}

const service = new Service();
export default service;
