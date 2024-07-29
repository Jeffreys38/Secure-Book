import axios from 'axios';

const endpoint = `${process.env.REACT_APP_SERVER_SERVICE}/api/comments`;

class CommentService {
    static async createComment(comment) {
        try {
            const response = await axios.post(`${endpoint}`, comment, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async getComments(postId) {
        try {
            const response = await axios.get(`${endpoint}/${postId}`, {
                headers: {
                    'access_token': localStorage.getItem('access_token')
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteComment(commentId) {
        try {
            const response = await axios.delete(`${endpoint}/${commentId}`, {
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

export default CommentService;