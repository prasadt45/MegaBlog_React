import conf from '../conf/conf.js';
import { Client, Databases, ID, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    storage;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }
    async createpost({ tittle, slug, content, image, status, userID }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                // document id will be slug that will be passed 
                slug,
                // document data
                {
                    tittle,
                    content,
                    image,
                    status,
                    userID,
                }
            )

        } catch (err) {
            console.log(err)
        }
    }
    // slug gives the document id we will take that first not in object form 

    async updatepost(slug, { tittle, content, image, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    tittle,
                    content,
                    image,
                    status,


                }
            )

        } catch (error) {
            console.log(error)

        }

    }
    // deleteDocument
    async deletepost(slug) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            )
            return true;

        } catch (error) {
            console.log(error)
            return false;

        }
    }
    // get particular post  by slug as it is doc id 

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,

            )


        } catch (err) {
            console.log(err)
        }
    }

    // Get All those posts whose  status is active 
    // we pass array of query
    // we have created indexes in appwrite database 
    // query only works on indexes 
    async getactivepost(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                queries , // quries whose staus is active 
            )



        } catch (error) {
            console.log(error)
        }
    }


    // UPLOAD FILE 
    async uploadFile(file){
        try{
            return await this.storage.createFile(

                conf.appwriteBucketID , 
                ID.unique() , 
                file 
            )
        }
        catch(e){
            console.log(e)
        }
    }

    // Delete File 

    async deleteFile(fileId){
        try {
            return await this.storage.deleteFile( 
                conf.appwriteBucketID ,
                 fileId
             )
            
        } catch (error) {
            console.log(error)
            return false ; 
            
        }

    }

    // Preview File 
    async previewFile(fileId){
        try {
            return await this.storage.getFilePreview(
                conf.appwriteBucketID , 
                fileId

            )
            
        } catch (error) {
            console.log(error)
            return false ; 
            
        }
    }


}

const service = new Service();
export default service;
