import generate_Salt_SHA256Hash from '../utils/generate_Salt_SHA256Hash.js';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from "mongodb";

const collectionName = "accounts";

class AccountController {
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

  static async checkToken(accessToken) {
    const conn = await this.connect();
    const accountCollection = conn.collection(collectionName);

    try {
      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);

      const account = await accountCollection.findOne({
        _id: new ObjectId(decoded._id)
      });
  
      if (account && account.accessToken === accessToken) {
        return true;
      } else {
        return false;
      }
    } catch(err) {
        return false;
    }
  }

  static async findAccount(account) {
    const dbConnection = await this.connect();
    const accountCollection = dbConnection.collection(collectionName);

    const existingAccount = await accountCollection.findOne({
      username: account.username
    });

    if (existingAccount) {
      const hashedPassword = generate_Salt_SHA256Hash(account.password, existingAccount.salt);

      const matchedAccount = await accountCollection.findOne({
        username: account.username,
        password: hashedPassword
      });

      if (matchedAccount) {

        // Nếu token không có thì cấp lại
        if (!matchedAccount.accessToken) {
          const accessToken = jwt.sign(matchedAccount, process.env.SECRET_KEY);

          await accountCollection.updateOne({
            _id: new ObjectId(matchedAccount._id)
          }, {
            $set: {
              accessToken: accessToken
            }
          });

          matchedAccount.accessToken = accessToken;
        }

        return {
          'userId': matchedAccount._id,
          'access_token': matchedAccount.accessToken
        };
      }

      return {
        code: 400,
        message: "Tên đăng nhập hoặc mật khẩu không hợp lệ"
      };
    }

    return {
      code: 400,
      message: "Account does not exist"
    };
  }

  static async addAccount(account) {
    const db = await this.connect();
    const accountCollection = db.collection(collectionName);
    
    const isExistUsername = await accountCollection.findOne({
      username: account.username
    });
    console.log("isExistUsername",isExistUsername + " " + account.username)

    if (isExistUsername) {
      return {
        code: 400,
        message: "Account already exists"
      };
    }

    const randomSalt = crypto.randomBytes(16).toString('hex');
    const passhash = generate_Salt_SHA256Hash(account.password, randomSalt);

    const Account = {
      username: account.username,
      password: passhash,
      salt: randomSalt
    };

    // Add token to account
    const token = jwt.sign(Account, process.env.SECRET_KEY);
    Account.token = token;

    const accountResult = await accountCollection.insertOne(Account);
    
    // Document of user
    delete account.password;
    delete account.username;
    const user = account
    user._id = accountResult.insertedId

    // Insert user
    const userCollection = db.collection("users");
    await userCollection.insertOne(user);

    return {
      code: 200,
      message: "Account created successfully",
      data: user
    };
  }
}

export default AccountController;
