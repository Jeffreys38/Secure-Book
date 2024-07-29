import axios from 'axios';
const endpoint = `${process.env.REACT_APP_SERVER_SERVICE}/api/users`;

class UserService {

    static async getUsers() {
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

    static async getUser(userId) {
        try {
            // Add token to header 
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

    static async updateUser(userId, data) {
        try {
            const formData = new FormData();
            formData.append("info", JSON.stringify(data))

            const response = await axios.put(`${endpoint}/${userId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': localStorage.getItem('access_token')
                },
            })

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async updateAvatar(userId, avatar) {
        try {
            const formData = new FormData();
            formData.append("avatar", avatar)

            const response = await axios.put(`${endpoint}/${userId}/avatar`, formData, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                },
            })

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async updateCover(userId, coverPhoto) {
        try {
            const formData = new FormData();
            formData.append("coverPhoto", coverPhoto)

            const response = await axios.put(`${endpoint}/${userId}/coverPhoto`, formData, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                },
            })

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default UserService

