import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/Header';
import { useSearchParams } from 'react-router-dom';
import PostComponent from "../components/Post";
import { PostType, PostService } from '../services/post.service.ts';

export default function SearchResult() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {    
        fetchData()
    }, []);

    async function fetchData() {
        const keyword = searchParams.get("q")
        const payload = await PostService.fetchData(PostType.SearchPostByKey, keyword)

        if (payload.code === 200) {
            console.log(payload.data)
            console.log("keyword", keyword)
            setPosts(payload.data)
        }
    }

    return (
        <div id="explore" >
            <Header title="Explore" isSearchBar={true} />

            <div className='row h-100 justify-space-between'>
                <NavigationBar />


                <div id="content" style={
                    {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                        flex: 1
                    }
                }>
                  {
                    posts.map((item, index) => (
                        <PostComponent key={index} post={item} customStyle={
                            { 
                                maxWidth: "598px"
                            }
                        } />
                    ))
                  }
                </div>
            </div>
        </div>
    );
}