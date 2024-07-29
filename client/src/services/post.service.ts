import axios from 'axios';
import Post from '../components/Post';

const endpoint = `${process.env.REACT_APP_SERVER_SERVICE}/api/posts`;

export const createPost = async (content: any, data: string | Blob) => {
    try {
        const form = new FormData()
        form.append('post', JSON.stringify(content))
        form.append('file', data)
        
        const response = await axios.post(endpoint, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'access_token': localStorage.getItem('access_token')
            },
        })

        return response.data;
       
    } catch (error) {
        console.error(error);
    }
}

export const getPosts = async (limit: any, offset: any) => {
    try {
        const response = await axios.get(endpoint, {
            params: {
                limit,
                offset
            },
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })

        return response.data;
       
    } catch (error) {
        console.error(error);
    }
}

export const deletePost = async (postId: any) => {
    try {
        const response = await axios.delete(`${endpoint}/${postId}`, {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })

        return response.data;
       
    } catch (error) {
        console.error(error);
    }
}

export const getPost = async (postId: any) => {
    try {
        const response = await axios.get(`${endpoint}/${postId}`, {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })

        return response.data;
       
    } catch (error) {
        console.error(error);
    }
}

// get post by user id with limit and offet
export const getPostByUserId = async (userId: any, limit: any, offset: any) => {
    try {
        const response = await axios.get(`${endpoint}/user/${userId}`, {
            params: {
                limit,
                offset
            },
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        })

        return response.data;
       
    } catch (error) {
        console.error(error);
    }
}

enum PostType {
    SearchPostByKey,
    Edit,
    Create,
    Delete
}

class PostService {
    static async fetchData(action: PostType, data: any) {
        let method;
        let url;
        let params;
        let headers = {
            'access_token': localStorage.getItem('access_token')
        }

        switch (action) {
            case PostType.SearchPostByKey:
                method = "get";
                url = endpoint;
                params = {
                    "offset": 0,
                    "limit": 8,
                    "keyword": data
                }
                break;
            case PostType.Edit:
                method = "put";
                url = endpoint
                break;
            case PostType.Create:
                break;
            case PostType.Delete:
                break;
        } 

        try {
            const response = await axios({ 
                method, 
                url, 
                data, 
                headers,
                params 
            });

            return response.data
           
        } catch (error) {
            console.error(error);
        }
    }
}

export { PostType, PostService }