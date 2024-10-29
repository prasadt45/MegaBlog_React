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

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // Check if user is logged in
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }
    }

    // Log out
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
