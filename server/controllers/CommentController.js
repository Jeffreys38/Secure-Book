import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config()

const client = new MongoClient(process.env.DB_CONNECTION_STRING);

const collectionName = "comments";

class CommentController {

  static async createComment(comment) {
    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      await db.collection(collectionName).insertOne(comment);

      // Get the owner of the comment
      const owner = await db.collection("users").findOne({ _id: new ObjectId(comment.owner) });
      comment.owner = owner;

      return {
        code: 200,
        message: "Comment created successfully",
        data: comment
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to create comment"
      }
    }
  }

  static async getComments(postId) {
    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);

      // Sort comments by creationTime using aggregation 
      const comments = await db.collection(collectionName)
      .find({ postId: postId })
      .sort({ creationTime: -1 })
      .toArray();

      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        const owner = await db.collection("users").findOne({ _id: new ObjectId(comment.owner) });
        comment.owner = owner;
      }


      return {
        code: 200,
        message: "Comments retrieved successfully",
        data: comments
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to retrieve comments"
      }
    }
  }

  static async deleteComment(commentId) {
    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      const comment = await db.collection(collectionName).findOne({ _id: new ObjectId(commentId) });

      await db.collection(collectionName).deleteOne({ _id: new ObjectId(commentId) });

      return {
        code: 200,
        message: "Comment deleted successfully",
        data: comment
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to delete comment"
      }
    }
  }
}

export default CommentController;
