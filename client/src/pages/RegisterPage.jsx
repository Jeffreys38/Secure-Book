import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/account.service';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();

    function handleInputChange(e) {
        const { id, value } = e.target;

        if (id === "firstName") {
            setFirstName(value);
        }
        if (id === "lastName") {
            setLastName(value);
        }
        if (id === "username") {
            setUsername(value)
        }
        if (id === "password") {
            setPassword(value);
        }
        if (id === "confirmPassword") {
            setConfirmPassword(value)
        }
    }

    function accountIsValid() {
        return (
            firstName.length >= 2 &&
            firstName.length <= 20 &&
            /^[\p{L}\s]+$/u.test(firstName) &&

            lastName.length >= 2 &&
            lastName.length <= 20 &&
            /^[\p{L}\s]+$/u.test(lastName) &&

            username.length >= 6 &&
            username.length <= 30 &&
            /^[A-Za-z0-9]+$/.test(username) &&

            /* Mật khẩu tối thiểu 
                + Từ 8 ký tự và không vượt quá 50 ký tự
                + Chứa số từ 0 - 9
                + Phải có ít nhất 1 ký tự viết hoa, viết thường
            */
            password.length >= 8 &&
            password.length <= 50 &&
            /[!@#$%^&*()_+[\]{};:'"\\|,.<>?]/.test(password) &&
            /[0-9]/.test(password) &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&

            password === confirmPassword
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (accountIsValid()) {
            const account = {
                'username': username,
                'password': password,
                'firstName': firstName,
                'lastName': lastName
            }

            const data = await register(account)
            if (data.code === 400) {
                alert("Tài khoản này đã tồn tại, vui lòng sử dụng tên tài khoản khác")
            } else {
                navigate('/login');
            } 
        }
        else {
            alert("Mật khẩu của bạn quá yếu, vui lòng đặt mật khẩu khác")
        }
    }

    return (
        <div id='wrap-full' style={
            {
                backgroundImage: `url(${process.env.REACT_APP_SERVER_SERVICE}/theme/1698592361989.jpeg)`,
            }
        }>
            <div id="wrapper-login">
                <form onSubmit={handleSubmit}>
                    <h1>Tạo tài khoản</h1>
                    <div className="input-box row">
                        <input id='firstName'
                            className='mr-15'
                            type="text"
                            placeholder="Tên"
                            value={firstName}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <input id='lastName'
                            type="text"
                            placeholder="Họ"
                            value={lastName}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div className="input-box">
                        <input id='username'
                            type="text"
                            placeholder="Tên tài khoản"
                            value={username}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-user" className="text-white material-symbols-outlined">
                            person
                        </span>
                    </div>
                    <div className="input-box">
                        <input id="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-lock" className="text-white material-symbols-outlined">
                            key
                        </span>
                    </div>
                    <div className="input-box">
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-lock" className="text-white material-symbols-outlined">
                            key
                        </span>
                    </div>
                    <button type="submit" className={
                        (isValid) ? 'btn' : 'btn btn-disable'
                    }>
                        Đăng ký tài khoản
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register;
