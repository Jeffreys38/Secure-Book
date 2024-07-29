import FriendCard from './FriendCard';
import SearchBar from './SearchBar';
import { useEffect, useState, useContext } from 'react';
import FriendService from '../services/friend.service';
import { useUserContext } from '../contexts/UserContext.js';
import socket from '../socket/socket-client';

export default function ListChat({ setSelectedFriend }) {
  const [friends, setFriends] = useState([]);
  const { user } = useUserContext();
  const [keyword, setKeyword] = useState('');
  const [backupFriends, setBackupFriends] = useState([]); // Backup friends to search
  
  useEffect(() => {
    getFriends()
  }, []);

  useEffect(() => {
    if (friends.length > 0) {
      setSelectedFriend(friends[0])
      setBackupFriends(friends);
    }
  }, [friends]);

  useEffect(() => {
    searchFriends();
  }, [keyword])
  

  async function getFriends() {
    try {
      const response = await FriendService.getFriends(user._id);

      if (response.code == 200) {
        setFriends(response.data);
       
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleFriendClick(friend) {
    setSelectedFriend(friend);
  }

  
  function searchFriends() {
    if (keyword === "") {
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
      
      <div id='list-listChat' className='wrap-list-item'>
        <div className="mt-25">
          <b className="heading ml-13">Hộp thư đến</b>
          <ul className="list-item">
            {
              friends.map((friend, index) => (
                <li key={index} onClick={() => handleFriendClick(friend)} className="row justify-content-space-between">
                  <FriendCard friend={friend}/>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}
