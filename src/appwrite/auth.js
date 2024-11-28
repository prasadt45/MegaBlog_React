import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class Authservice {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID);
        this.account = new Account(this.client);
    }

    // Method to create account and log in
    async createAcc({ email, password, name }) {
        try {
            const useracc = await this.account.create(ID.unique(), email, password, name);
            if (useracc) {
                return this.login({ email, password });
            } else {
                return useracc;
            }
        } catch (err) {
            throw err;
        }
    }

    // Login method to create email session
    async login({ email, password }) {
        try {
            const session = await this.account.createEmailSession(email, password);
            return session; // Ensure this returns the session
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    // Check if user is logged in
    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user; // Return user if logged in
        } catch (error) {
            // Handle unauthorized error and propagate the error
            if (error.code === 401) {
                console.error("User not authenticated: ", error);
                throw new Error("User is not authenticated. Please log in.");
            } else {
                throw error;
            }
        }
    }

    // Log out method to delete user sessions
    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }
}

const authservice = new Authservice();
export default authservice;
