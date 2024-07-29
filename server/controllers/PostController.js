import { MongoClient, ObjectId } from "mongodb";

const collectionName = "posts";

class PostController {
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

  static async createPost(post) {
    const db = await this.connect();

    try {
      await db.collection(collectionName).insertOne(post);
      
      // Find info of the owner of the post
      const user = await db.collection("users").findOne({ _id: new ObjectId(post.owner) });
      post.owner = user;

      // Get comment count of the post
      const comments = await db.collection("comments").find({ postId: post._id.toString() }).toArray();
      post.comments = comments;

      return {
        code: 200,
        message: "Post created successfully",
        data: post
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to create post"
      }
    }
  }

  static async getPosts(limit, offset, keyword) {
    const db = await this.connect();

    try {
      const posts = await db.collection(collectionName).aggregate([
        { $sort: { creationTime: -1 } },
        { $skip: offset },
        { $limit: limit },
        { $match: { content: RegExp(keyword, 'i') } }
      ]).toArray();

      // Find info of the owner of each post
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        const user = await db.collection("users").findOne({ _id: new ObjectId(post.owner) });
        post.owner = user;
      }

      // Get total number of loves of each post
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        const loves = await db.collection("reactions").find({ postId: post._id.toString() }).toArray();
        post.loves = loves.length;
      }

      // Get total number of comments of each post
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        const comments = await db.collection("comments").find({ postId: post._id.toString() }).toArray();
        post.comments = comments;
      }
      
      return {
        code: 200,
        message: "Get posts successfully",
        data: posts
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to get posts"
      }
    }
  }

  static async getPost(postId) {
    const db = await this.connect();

    try {
      const post = await db.collection(collectionName).findOne({ _id: new ObjectId(postId) });
      
      // Find info of the owner of the post
      const user = await db.collection("users").findOne({ _id: new ObjectId(post.owner) });
      post.owner = user;

      // Get total number of loves of the post
      const loves = await db.collection("reactions").find({ postId: postId }).toArray();
      post.loves = loves;

      // Get total number of comments of the post
      const comments = await db.collection("comments").find({ postId: postId }).toArray();
      post.comments = comments;

      return {
        code: 200,
        message: "Get post successfully",
        data: post
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to get post"
      }
    }
  }

  static async deletePost(postId) {
    const db = await this.connect();

    try {
      await db.collection(collectionName).deleteOne({ _id: new ObjectId(postId) });

      return {
        code: 200,
        message: "Delete post successfully",
        data: postId
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to delete post"
      }
    }
  }

  static async getPostByUserId(userId, limit, offset) {
    const db = await this.connect();

    try {
      // Find info of the owner of each post, sort posts by created date (descending), and apply limit and offset
      const posts = await db.collection(collectionName).aggregate([
        { $match: { owner: userId } },
        { $sort: { creationTime: -1 } },
        { $skip: offset },
        { $limit: limit }
      ]).toArray();

      // Get total number of loves of each post
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        const loves = await db.collection("reactions").find({ postId: post._id.toString() }).toArray();
        post.loves = loves.length;
      }

      return {
        code: 200,
        message: "Get posts successfully",
        data: posts
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to get posts"
      }
    }
  }

  static async editPost(post) {
    const db = await this.connect();

    try {
      await db.collection(collectionName).updateOne(
        { _id: new ObjectId(post._id) },
        { $set: 
          { 
            content: post.content 
          } 
        }
      );

      return {
        code: 200,
        message: "Edit post successfully",
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to edit post"
      }
    }
  }
}

export default PostController;
