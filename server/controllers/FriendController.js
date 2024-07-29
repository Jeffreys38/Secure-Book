import { MongoClient, ObjectId } from "mongodb";

const collectionName = "friends";

class FriendController {
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

    static async getFriends(id) {
        const db = await this.connect();
        const friendDocument = await db.collection(collectionName).findOne({ owner: id });   // friend document in db
        
        if (friendDocument) {
            const friendsId = friendDocument.friends;                                            // array of friends
            
            const friends = [];
            for (const friendId of friendsId) {
                const friend = await db.collection("users").findOne({ _id: new ObjectId(friendId) });
                friends.push(friend);
            }
            return {
                "code": 200,
                "message": "Friends found",
                "data": friends
            };
        } else {
            return {
                "code": 404,
                "message": "Friends not found"
            }
        }
    }

    static async updateFriend(id, updateFields) {
        const db = await this.connect();
        const friendCollection = db.collection(collectionName);
        
        // If owner not exist, create new friend document
        const friendDocument = await friendCollection.findOne({ owner: id });
        if (!friendDocument) {
            const result = await friendCollection.insertOne({
                owner: id,
                friends: []
            });
        } else {
            const result = await friendCollection.updateOne(
                { owner: id },
                {
                    $set: updateFields
                }
            )

            if (result.modifiedCount === 0) {
                return {
                    "code": 400,
                    "message": "Friend not updated"
                };
            }
        }

        return {
            "code": 200,
            "message": "Friend updated"
        };
    }
}

export default FriendController;
