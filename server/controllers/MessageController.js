import { Int32, MongoClient, ObjectId } from "mongodb";

const collectionName = "messages";

export default class MessageController {
    static async addMessage(message) {
        try {
            const client = new MongoClient(process.env.DB_CONNECTION_STRING);
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            await db.collection(collectionName).insertOne(message);


            // Get info of receiverId
            const receiver = await db.collection("users").findOne({ _id: new ObjectId(message.receiverId) });
            message.receiver = receiver;
            delete message.receiverId;

            // Get info of senderId
            const sender = await db.collection("users").findOne({ _id: new ObjectId(message.senderId) });
            message.sender = sender;
            delete message.senderId;
            
            return {
                code: 200,
                message: "Message created successfully",
                data: message
            }
        } catch (error) {
            console.log(error)

            return {
                code: 500,
                message: "Failed to create message"
            }
        }
    }

    static async getMessages() {
        try {
            const client = new MongoClient(process.env.DB_CONNECTION_STRING);
            await client.connect();
            const db = client.db(process.env.DB_NAME);

            const messages = await db.collection(collectionName).find().toArray();
            
            return {
                code: 200,
                message: "Messages retrieved successfully",
                data: messages
            }
        } catch (error) {
            console.log(error)

            return {
                code: 500,
                message: "Failed to retrieve messages"
            }
        }
    }

    static async getMessagesByOwner(owner, limit = 4) {
        const client = new MongoClient(process.env.DB_CONNECTION_STRING);
        await client.connect();
        const db = client.db(process.env.DB_NAME);

        try {
            // Người nhận là owner
            // Người gửi phải khác nhau
            // Sắp xếp theo thời gian gửi sớm nhất
            const messages = await db.collection(collectionName).aggregate([
                {
                  '$match': {
                    'receiverId': owner
                  }
                }, {
                  '$group': {
                    '_id': '$senderId', 
                    'message': {
                      '$last': '$$ROOT'
                    }
                  }
                }, {
                  '$replaceRoot': {
                    'newRoot': '$message'
                  }
                }, {
                  '$sort': {
                    'timestamp': -1
                  }
                }
              ]
            ).limit(parseInt(limit)).toArray()

            for (const message of messages) {
                message["sender"] = await db.collection("users").findOne({
                    _id: new ObjectId(message["senderId"])
                })
                delete message["senderId"]

                message["receiver"] = await db.collection("users").findOne({
                    _id: new ObjectId(message["receiverId"])
                })
                delete message["receiverId"]
            }

            return {
                code: 200,
                message: "Messages retrieved successfully",
                data: messages
            }
        } catch (error) {
            console.log(error)

            return {
                code: 500,
                message: "Failed to retrieve messages"
            }
        }

        return 
    }

    static async getConversation(userId1, userId2) {
        try {
            const client = new MongoClient(process.env.DB_CONNECTION_STRING);
            await client.connect();
            const db = client.db(process.env.DB_NAME);

            const messages = await db.collection(collectionName).find({
                $or: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 }
                ]
            }).toArray();

            // Get info of every receiverId
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                const receiver = await db.collection("users").findOne({ _id: new ObjectId(message.receiverId) });
                message.receiver = receiver;

                const sender = await db.collection("users").findOne({ _id: new ObjectId(message.senderId) });
                message.sender = sender;

                delete message.senderId;
                delete message.receiverId;
            }

            return {
                code: 200,
                message: "Messages retrieved successfully",
                data: messages
            }
        } catch (error) {
            console.log(error)

            return {
                code: 500,
                message: "Failed to retrieve messages"
            }
        }
    }

    static async deleteMessage(messageId) {
        try {
            const client = new MongoClient(process.env.DB_CONNECTION_STRING);
            await client.connect();
            const db = client.db(process.env.DB_NAME);

            await db.collection(collectionName).deleteOne({ _id: new ObjectId(messageId) });

            return {
                code: 200,
                message: "Message deleted successfully"
            }
        } catch (error) {
            console.log(error)

            return {
                code: 500,
                message: "Failed to delete message"
            }
        }
    }
}