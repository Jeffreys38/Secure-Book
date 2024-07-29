import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv'

dotenv.config()
const collectionName = "reactions";

class ReactionController {
    static async connect() {
        const client = new MongoClient(process.env.DB_CONNECTION_STRING);

        try {
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            return db;
        } catch (error) {
            console.error("Failed to connect to the database:", error);
            throw error;
        }
    }

    static async addReaction(postId, owner) {
        try {
            const db = await this.connect();
            const reactionCollection = db.collection(collectionName);
            const reaction = await reactionCollection.insertOne({ 
                owner: owner,
                postId: postId,
            });

            // Update count loves in post
            const postCollection = db.collection("posts");

            const post = await postCollection.findOne({ _id: new ObjectId(postId) });
            await postCollection.updateOne(
                { _id: new ObjectId(postId) },
                { $set: { loves: post.loves + 1 } }
            );

            // Get total loves for postId
            const reactions = await reactionCollection.find({
                postId: postId,
            }).toArray();

            return {
                code: 200,
                message: "Add loves successfully",
                data: reactions.length
            };
        } catch (error) {
            console.log(error);
        }
    }

    static async checkReaction(postId, owner) {
        try {
            const db = await this.connect();
            const reactionCollection = db.collection(collectionName);
            const reaction = await reactionCollection.findOne({ 
                owner: owner,
                postId: postId,
             });

            return {
                code: 200,
                message: "Get loves successfully",
                data: reaction
            };
        } catch (error) {
            console.log(error);
        }
    }

    static async getTotalReaction(postId) {
        try {
            const db = await this.connect();
            const reactionCollection = db.collection(collectionName);
            const reactions = await reactionCollection.find({
                postId: postId,
            }).toArray();

            return {
                code: 200,
                message: "Get loves successfully",
                data: reactions
            };
        } catch (error) {
            console.log(error);
        }
    }

    static async removeReaction(postId, owner) {
        try {
            const db = await this.connect();
            const reactionCollection = db.collection(collectionName);
            const reaction = await reactionCollection.deleteOne({ 
                owner: owner,
                postId: postId,
             });

            // Update count loves in post
            const postCollection = db.collection("posts");
            const post = await postCollection.findOne({ _id: new ObjectId(postId) });
            await postCollection.updateOne(
                { _id: new ObjectId(postId) },
                { $set: { loves: post.loves - 1 } }
            );

            // Get total loves for postId
            const reactions = await reactionCollection.find({
                postId: postId,
            }).toArray();

            return {
                code: 200,
                message: "Remove loves successfully",
                data: reactions.length
            };
        } catch (error) {
            console.log(error);
        }
    }
}

export default ReactionController;
