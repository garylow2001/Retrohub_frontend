import React from "react";
import { useState} from "react";
// import './Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAppState } from "../AppState";

const SIGN_IN_URL = "http://localhost:3000/login"
const SIGN_UP_URL = "http://localhost:3000/users"


const Auth = () => {
    // const type = props.match.params.form;
    const navigate = useNavigate()
    const goThreads = () => {
        return navigate('/threads')
    }
    const [AuthType,setAuthType] = useState("login")
    const [formData,setFormData] = useState({
        username: "",
        password: ""
    })

    const actions = (type:string) => {
        if (type === "login") {
            return axios.post(SIGN_IN_URL, {"username":formData.username,"password":formData.password}).then(
                (resp) => {
                    dispatch({type: "login", payload: {
                        token: resp.data.token, 
                        username: resp.data.user.username, 
                        user_id: resp.data.user.id
                    }})
                    goThreads()
                }
            ).catch(
                (err) => {
                    alert("wrong username/password")
                    setFormData({username:"",password:""})
                }
            )
        }
        else if (type === "signup") {
            return axios.post(SIGN_UP_URL, {"username":formData.username,"password":formData.password}).then(
                (resp) => {
                    alert("Welcome to Bluedit "+resp.data.user.username+ " you may login now!")
                    setAuthType("login")
                    setFormData({username:"",password:""})
                }
            ).catch(
                (err) => {
                    alert("wrong username/password")
                    setFormData({username:"",password:""})
                }
            )
        }
        else {
            alert("unidentified action")
        }
    }

    const {dispatch} = useAppState()

    const changeAuthType = () => {
        if (AuthType==="login") {
            setAuthType("signup")
        }
        else {
            setAuthType("login")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    }

    const handleSubmit = async (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        actions(AuthType)
    }
    return (
        <div className="w-screen max-w-md">
            <h1 className="mt-6 text-center text-4xl font-bold tracking-tight white"> Welcome to BlueDit</h1>
            <h1 className="mt-2 text-center text-3xl white"> {(AuthType==="login")?"Sign In":"Sign Up"}</h1>
            <form className="space-y-0.25 mt-8"onSubmit={handleSubmit}>
                <div className="-space-y-px rounded-md shadow-sm">
                {/* <label htmlFor="username">Username:</label> */}
                <input 
                    type="text"
                    id = "username"
                    autoComplete = "off"
                    onChange= {handleChange}
                    value = {formData.username}
                    required
                    placeholder="Username..."
                    className="relative block w-full appearance-none rounded-md border border-gray-300 
                    px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 
                    focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                </div>
                <div className="-space-y-px rounded-md shadow-sm">
                {/* <label htmlFor="password">Password:</label> */}
                <input 
                    type="password"
                    id = "password"
                    onChange={handleChange}
                    value = {formData.password}
                    required
                    placeholder="Password..."
                    className="relative block w-full appearance-none rounded-md border border-gray-300 
                    px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 
                    focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                </div>
                <div className="">
                    <button className="mt-8 relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 
                    text-sm font-medium text-white hover:bg-indigo-700 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        {(AuthType==="login")?"Sign In":"Sign Up"}
                    </button>
                </div>
            </form>
            <button onClick={changeAuthType} className="group relative flex w-full justify-center rounded-md 
                 bg-slate-600 py-2 px-4 
                text-sm font-medium text-white hover:bg-slate-700 ">
                    Or Click Here To {(AuthType==="login")?"Sign Up":"Sign In"}
                    </button>
        </div>
    )
}

export default Auth