import { useRef } from "react"

export default function FriendCard({ friend, isRedirect }) {
    const domain = process.env.REACT_APP_SERVER_SERVICE;

    function redirectToProfile() {
        window.location.href = `/profile/${friend._id}`;
    }
    
    return (
        <div className="row" onClick={ (isRedirect) ? redirectToProfile : null }>
            <div className="wrap-avatar">
                <span className="activity-status activity-status-online" />
                <img
                    className="avatar-small"
                    src={`${domain}/users/${friend._id}/${friend.avatar}`}
                    alt="avatar"
                />
            </div>

            <p className="flex align-items-center ml-8">{friend.firstName + " " + friend.lastName}</p>

        </div>
    )
}