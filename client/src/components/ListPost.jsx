import React, { useState, useEffect, useRef } from "react";
import PostComponent from "./Post";
import { getPosts } from "../services/post.service.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import socket from "../socket/socket-client";

export default function ListPost({ listPostRef }) {
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(false)

    const maxPost = useRef(0);
    const limit = 4;
    const offset = 0;

    useEffect(() => {
        fetchMoreData()
    }, [])

    useEffect(() => {
        listPostRef.current = posts;
    }, [posts])

    // Cap nhat emoji realtime
    useEffect(() => {
        socket.on("recieveEmoji", (payload) => {
            const { postId, reaction } = payload;
            
            const newPosts = posts.map((item) => {
                if (item._id === postId) {
                    item.loves = reaction.data;
                }
                return item;
            });

            setPosts(newPosts);
        });
    
        return () => {
            socket.off("recieveEmoji");
        };
    })

    useEffect(() => {
        socket.on("delete-post", (payload) => {
            if (posts.length === 0) return;
    
            const postId = payload.data;
            const newPosts = posts.filter((item) => item._id !== postId);
            setPosts(newPosts);
        });
    
        socket.on("new-post", (payload) => { 
            // Thêm new post vào đầu mảng
            setPosts([payload.data, ...posts]);
        });
    
        return () => {
            socket.off("delete-post");
            socket.off("new-post");
        };
    });

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
    }      
    
    async function fetchMoreData() {
        const payload = await getPosts(limit, offset + maxPost.current)

        if (payload.data.length > 0) {
            // Shuffle post
            shuffleArray(payload.data);

            // Add new post to list post
            setPosts([...posts, ...payload.data])
            maxPost.current += payload.data.length

            // Check has more post
            setHasMore(true)
        } else {
            setHasMore(false)
        }
    }

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            scrollableTarget="content"
            style={
                {
                    overflow: "hidden"
                }
            }
        >
            {
                posts.map((item, index) => (
                    <PostComponent key={index} post={item} posts={posts} />
                ))
            }
        </InfiniteScroll>
    );
}