import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv'

dotenv.config()
const collectionName = "users";

class UserController {
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

    static async getUser(id) {
        try {
            const db = await this.connect();
            const userCollection = db.collection(collectionName);
            const user = await userCollection.findOne({ _id: new ObjectId(id) });

            // Get total post of user
            const postCollection = db.collection("posts");
            const totalPost = await postCollection.countDocuments({ owner: id });
            user.totalPost = totalPost;

            // Get total friend of user
            const friendCollection = db.collection("friends");
            const result = (await friendCollection.findOne({ owner: id }))

            if (result)
                user.friends = result.friends
            else
                user.friends = []


            return {
                code: 200,
                message: "Get user successfully",
                data: user
            };
        } catch (error) {
            console.log(error);

            return {
                code: 500,
                message: "User not exist",
            }
        }
    }

    static async getUsers() {
        try {
            const db = await this.connect();
            const userCollection = db.collection(collectionName);
            const users = await userCollection.find().toArray();

            return {
                code: 200,
                message: "Get users successfully",
                data: users
            };
        } catch (error) {
            console.log(error);
        }
    }

    static async updateUser(id, updateFields) {
        try {
            const db = await this.connect();
            const userCollection = db.collection(collectionName);

            const result = await userCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: updateFields
                }
            )

            return {
                code: 200,
                message: "Update user successfully",
                data: updateFields
            };
        } catch (error) {
            console.log(error);

            return {
                code: 500,
                message: "Update user failed",
                data: error
            }
        }
    }
}

export default UserController;
