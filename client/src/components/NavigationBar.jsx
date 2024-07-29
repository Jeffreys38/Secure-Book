import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect } from 'react';

export default function NavigationBar() {
    const { theme, toggleTheme, themeObject } = useTheme();

    function signOut() {
        localStorage.clear();
        window.location.href = '/login';
    }

    return (
        <div id="vertical-navigation-bar" className="bg-white">
            <div className='flex-1'>
                {/* GROUP ITEM */}
                <div className="mt-25">
                    <b className="heading ml-13">Menu</b>
                    <ul className="list-item">
                        <Link to="/">
                            <li className="row">
                                <img
                                    className="icon-heading"
                                    src="https://img.icons8.com/doodle/48/home--v1.png"
                                    alt="home--v1"
                                />
                                <p className="ml-10">Trang chủ</p>

                            </li>
                        </Link>

                        <Link to="/profile">
                            <li className="row">
                                <img className="icon-heading" src="https://img.icons8.com/windows/32/gender-neutral-user.png" alt="gender-neutral-user" />
                                <p className="ml-10">Trang cá nhân</p>
                            </li>
                        </Link>

                        <Link to="/chat">
                            <li className="row">
                                <img
                                    className="icon-heading"
                                    src="https://img.icons8.com/pulsar-color/48/chat-message.png"
                                    alt="chat-message"
                                />
                                <p className="ml-10">Nhắn tin</p>
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>

            <button style={themeObject.button} className='btn btn-blue' onClick={signOut}>Đăng xuất</button>
        </div>
    )
}