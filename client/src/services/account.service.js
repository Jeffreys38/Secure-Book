import axios from 'axios';

const endpoint = `${process.env.REACT_APP_SERVER_SERVICE}/api/auth`;

export const register = async (account) => {
    try {
        let res = await axios.post(`${endpoint}/register`, account);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

export const login = async (account) => {
    try {
        let res = await axios.post(`${endpoint}/login`, account);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

export const logout = async (account) => {
    try {
        let res = await axios.get(`${endpoint}/logout`, account);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}