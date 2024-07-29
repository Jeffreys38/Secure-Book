import axios from 'axios';

const endpoint = `${process.env.REACT_APP_SERVER_SERVICE}/api/reactions`;

export const removeReaction = async (postId, owner) => {
    try {
        let response = await axios.delete(`${endpoint}/?postId=${postId}&owner=${owner}`, {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        });
        
        return response.data;
    
    } catch (error) {
        console.log(error);
    }
}

export const addReaction = async (postId, owner) => {
    try {
        let response = await axios.post(`${endpoint}`, {postId, owner}, {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        });
        return response.data;
    
    } catch (error) {
        console.log(error);
    }
}

export const checkReaction = async (postId, owner) => {
    try {
        let response = await axios.get(`${endpoint}/?postId=${postId}&owner=${owner}`, {
            headers: {
                'access_token': localStorage.getItem('access_token')
            }
        });
        return response.data;
    
    } catch (error) {
        console.log(error);
    }
}