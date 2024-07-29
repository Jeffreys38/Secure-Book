
import SearchBar from './SearchBar'
import ToggleButton from './ToggleButton.jsx';
import { useUserContext } from '../contexts/UserContext.js';
import Notification from './Notification.jsx';

export default function Header({ title, isSearchBar, customStyle, listPostRef }) {
    const domain = process.env.REACT_APP_SERVER_SERVICE;
    const { user } = useUserContext();

    return (
        <div id="header" className={customStyle}>
            <div className='flex align-items-center justify-space-between'>
                <h3>{title}</h3>
            </div>

            <div id='search-bar'>{(isSearchBar) ? <SearchBar listPostRef={listPostRef} placeholder="Tìm kiếm bài viết" /> : ""}</div>

            <div id='menu' className="row center">
                <ToggleButton />
                <Notification />
                <div className='row align-items-center'>
                    <span className="ml-10 mr-10 m-content">{user.firstName} {user.lastName}</span>
                    <img
                        onClick={() => { window.location.href = "/profile/" + user._id }}
                        className="avatar"
                        src={`${domain}/users/${user._id}/${user.avatar}`}
                        alt="avatar"
                    />
                </div>
            </div>
        </div>
    )
}