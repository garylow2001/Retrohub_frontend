import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Posts from '../components/ThreadList';
import { useAppState } from '../AppState';
import { Navbar } from '../components/Navbar';


const API_URL = "https://retrohub-backend.herokuapp.com/posts"
export interface postInterface {
    id: number,
    title: string,
    body: string,
    category: string,
    username: string,
    updated_at: string
}
export interface postsInterface extends Array<postInterface>{}

const Threads = () => {
    const navigate = useNavigate()
    const {state} = useAppState()
    const [allPosts,setAllPosts] = useState<postsInterface>([]);
    const [posts,setposts] = useState<postsInterface>([]);

    const goHome = () => {
        return navigate("/")
    }

    const handleChangeCategory = (cat:string) => {
        if (cat === "all") {
            setposts(allPosts)
        }
        else {
            let filtered_posts = allPosts.filter(post=> post.category === cat)
            setposts(filtered_posts)
        }
    }
    useEffect(()=> {
        let mounted = true;
        axios.get(API_URL, {
            headers: {
                "authorization": "bearer " + state.token
            }
        }).then(
            (resp) => { 
                if (resp.data) {
                    console.log(resp.data) // comment out once done
                    setposts(resp.data)
                    setAllPosts(resp.data)
                }
            }
        ).catch(
            (err) => {
                if (err.response.data.message === "Please log in") {
                    goHome()
                    alert("you need to login first!")
                }
                else {
                    console.log(err)
                }
            }
        )
        return () => {mounted = false}; 
    }, []);
    
    return (
        <div className='justify-center w-full align-top min-h-screen max-h-full'>
            <Navbar handleChangeCategory={handleChangeCategory} page="Threads"/>
            <div className='height-100% justify-self-center align-top'>
                <h1 className='relative mt-20 align-top font-coolvetica text-4xl px-2 py-2 mb-5'>Let's see whats cooking today!</h1>
                <Link to= "/post/new" 
                    className='m-5 px-2 py-2 font-coolvetica border-2 border-black rounded-md bg-red-600 text-black
                    hover:bg-red-400'>Click here to start a new thread!</Link>
                <Posts posts={posts} />
            </div>
        </div>
    )
}
export default Threads;