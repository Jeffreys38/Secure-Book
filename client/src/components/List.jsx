import SearchBar from './SearchBar'
import { useEffect, useState, useRef } from 'react'
import socket from '../socket/socket-client'
import listFriendsStyle from '../styles/listFriends.css'
import FriendCard from './FriendCard'

export default function List({ items, keyword, title }) {
  return (
    <div id="right-side-bar">
      <SearchBar placeholder={keyword} />

      <div id='list-friends' className='wrap-list-item'>
        <div className="mt-25">
          <b className="heading ml-13">{title}</b>
          <ul className="list-item">

          </ul>
        </div>
      </div>
    </div>
  )
}
