import { Int32, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { parse } from "path";
dotenv.config()

class MusicController {
  static async createMusic(music) {
    try {
      const client = new MongoClient(process.env.DB_CONNECTION_STRING);
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      await db.collection("musics").insertOne(music);

      return {
        code: 200,
        message: "Music created successfully",
        data: music
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to create music"
      }
    }
  }

  static async getMusics() {
    try {
      const client = new MongoClient(process.env.DB_CONNECTION_STRING);
      await client.connect();
      const db = client.db(process.env.DB_NAME);

      const musics = await db.collection("musics").find().toArray();
      
      return {
        code: 200,
        message: "Musics retrieved successfully",
        data: musics
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to retrieve musics"
      }
    }
  }

  static async deleteMusic(musicId) {
    try {
      const client = new MongoClient(process.env.DB_CONNECTION_STRING);
      await client.connect();
      const db = client.db(process.env.DB_NAME);

      await db.collection("musics").deleteOne({ _id: musicId });

      return {
        code: 200,
        message: "Music deleted successfully"
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to delete music"
      }
    }
  }

  static async getMusicById(musicId) {
    try {
      const client = new MongoClient(process.env.DB_CONNECTION_STRING);
      await client.connect();
      const db = client.db(process.env.DB_NAME);

      const music = await db.collection("musics").findOne({ _id: musicId });

      return {
        code: 200,
        message: "Music retrieved successfully",
        data: music
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to retrieve music"
      }
    }
  }

  static async getMusicByOwnerId(ownerId, limit, offset) {
    try {
      const client = new MongoClient(process.env.DB_CONNECTION_STRING);
      await client.connect();
      const db = client.db(process.env.DB_NAME);

      const musics = await db.collection("musics")
        .find({ owner: ownerId })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .toArray();

      return {
        code: 200,
        message: "Musics retrieved successfully",
        data: musics
      }
    } catch (error) {
      console.log(error)

      return {
        code: 500,
        message: "Failed to retrieve musics"
      }
    }
  }
  
}
export default MusicController