import React, { useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';

export default function Explore() {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname.match(/^\/explore\/p\/\d+$/)) {
         alert('This is a profile page');
        }
      }, [location.pathname]);

    return (
        <div id="explore" >
            <Header title="Explore" isSearchBar={true} />

            <div className='row h-100 justify-space-between'>
                <NavigationBar />

                <div id="content">
                   
                </div>
            </div>
        </div>
    );
}