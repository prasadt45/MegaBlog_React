import { Client, Account, ID } from 'appwrite';
import conf from '../conf/conf.js'; // Adjust the path if necessary

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // Appwrite endpoint
            .setProject(conf.appwriteProjectId); // Appwrite project ID

        this.account = new Account(this.client); // Initialize Account object
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            console.log('Account created successfully:', userAccount);

            // Automatically log in the user
            return await this.login({ email, password });
        } catch (error) {
            console.error('Error during account creation:', error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            // Correcting the session creation method name
            const session = await this.account.createEmailPasswordSession(email, password);
            console.log('Session created:', session);
            return session;
        } catch (err) {
            console.error('Error creating session:', err);
            throw new Error('Login failed. Please check your email and password.');
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    }
    

    async logout() {
        try {
            await this.account.deleteSessions();
            console.log('Logged out successfully.');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
}

const authService = new AuthService();
export default authService;
