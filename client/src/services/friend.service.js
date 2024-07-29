import axios from 'axios';

const endpoint = `${process.env.REACT_APP_SERVER_SERVICE}/api/friends`;

class FriendService {
    static async updateFriend(userId, updateFields) {
        try {
            console.log(updateFields, userId)
            const response = await axios.put(`${endpoint}/${userId}`, updateFields, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async getFriends(userId) {
        try {
            const response = await axios.get(`${endpoint}/${userId}`, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteFriend(friendId) {
        try {
            const response = await axios.delete(`${endpoint}/${friendId}`, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default FriendService;