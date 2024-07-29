import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/account.service';
import { useUserContext } from '../contexts/UserContext';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUserContext();

    function handleInputChange(e) {
        const { id, value } = e.target;

        if (id === "username") {
            setUsername(value)
        }
        if (id === "password") {
            setPassword(value);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const account = {
            'username': username,
            'password': password
        }
        
        try {
            const payload = await login(account)

            localStorage.setItem('access_token', payload.access_token)
            localStorage.setItem('userId', payload.userId)
            navigate('/')

        } catch (error) {
            console.log(error)
        }
    }

    function redirectRegister() {
        navigate('/register')
    }

    return (
        <div id='wrap-full' style={
            {
                backgroundImage: `url(${process.env.REACT_APP_SERVER_SERVICE}/theme/1698592361989.jpeg)`,
            }
        }>
            <div id="wrapper-login">
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            id='username'
                            name="login-input-user"
                            type="text"
                            placeholder="User name"
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-user" className="text-white material-symbols-outlined">
                            person
                        </span>
                    </div>
                    <div className="input-box">
                        <input
                            id="password"
                            name="login-input-password"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-lock" className="text-white material-symbols-outlined">
                            key
                        </span>
                    </div>
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="./forgot-pass.html"> Forgot password?</a>
                    </div>
                    <button type="submit" className="btn">
                        Login
                    </button>
                    <div className="register-btn">
                        <p>
                            Don't have an account? <label id="btn-register" onClick={redirectRegister}> Register </label>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
