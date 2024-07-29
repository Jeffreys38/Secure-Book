import React, { useEffect, useState } from 'react';
import FriendCard from './FriendCard';
import SearchBar from './SearchBar';
import FriendService from '../services/friend.service';
import { useUserContext } from '../contexts/UserContext.js';

export default function ListFriends({ isRedirect }) {
  const [friends, setFriends] = useState([]);
  const [backupFriends, setBackupFriends] = useState([]); // Backup friends to search
  const [keyword, setKeyword] = useState('');
  const { user } = useUserContext();

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    searchFriends();
  }, [keyword]);

  async function fetchFriends() {
    try {
      const response = await FriendService.getFriends(user._id);

      if (response.code == 200) {
        setFriends(response.data);
        setBackupFriends(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function searchFriends() {
    if (keyword == "") {
      setFriends(backupFriends);
      return;
    }

    // Join firstName and lastName to search
    for (const friend of backupFriends) {
      friend.fullName = friend.firstName + ' ' + friend.lastName;
    }

    // Find with keyword
    const result = [];
    for (const friend of backupFriends) {
      if (friend.fullName.toLowerCase().includes(keyword.toLowerCase())) {
        result.push(friend);
      }
    }
    setFriends(result);
  }

  return (
    <div id="right-side-bar">
      <SearchBar placeholder="Tìm kiếm bạn bè" keyword={keyword} setKeyWord={setKeyword} />

      <div id='list-friends' className='wrap-list-item'>
        <div className="mt-25">
          <b className="heading ml-13">Friends</b>
          <ul className="list-item">
            {
              friends.map((friend, index) => (
                <li key={index} className="row justify-content-space-between">
                  <FriendCard friend={friend} isRedirect={true}/>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}
