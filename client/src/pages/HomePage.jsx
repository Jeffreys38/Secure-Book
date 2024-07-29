import React, { useEffect, useRef } from 'react';
import ListPost from '../components/ListPost';
import HandlePost from '../components/HandlePost';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/Header';
import Stories from '../components/Stories';
import ListFriends from '../components/ListFriends';
import { useTheme } from '../contexts/ThemeContext';

export default function HomePage() {
    const { themeObject } = useTheme();
    const listPostRef = useRef();

    return (
        <div id="homepage" style={themeObject.app}>
            <Header title="Trang chủ" isSearchBar={true} listPostRef={listPostRef} />

            <div className='row h-100 justify-space-between'>
                <NavigationBar />

                <div id="content">
                    <Stories />
                    <HandlePost />
                    <ListPost listPostRef={listPostRef} />
                </div>

                <ListFriends isRedirect={true} />
            </div>
        </div>
    );
}