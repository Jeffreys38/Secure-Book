import axios from 'axios';

const endpoint = `${process.env.REACT_APP_SERVER_SERVICE}/api/messages`;

class MessageService {
    static async createMessage(message) {
        try {
            const response = await axios.post(`${endpoint}`, message, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async getMessages() {
        try {
            const response = await axios.get(`${endpoint}`, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async getMessagesByOwner(limit) {
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.get(`${endpoint}/${userId}`, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                },
                params: {
                    limit: limit
                }
            });

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteMessage(messageId) {
        try {
            const response = await axios.delete(`${endpoint}/${messageId}`, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    // Get message between two users
    static async getConversation(userId1, userId2) {
        try {
            const response = await axios.get(`${endpoint}/conversation/${userId1}/${userId2}`, {
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

export default MessageService;