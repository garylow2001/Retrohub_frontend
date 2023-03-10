import React, { useContext, useReducer } from "react";
import Cookies from "universal-cookie";

////////////////////
// INITIAL STATE
////////////////////
const cookies = new Cookies()

const initialState = {
    url: "https://retrohub-backend.herokuapp.com/",
    token: cookies.get('jwt_authorization'),
    username: cookies.get('username'),
    user_id: cookies.get('user_id'),
    selected_post_id: cookies.get('selected_post_id')
}

interface StateInterface {
    url: string,
    token: string,
    username: string,
    user_id: number,
    selected_post_id: number
}


////////////////////
// REDUCER
///////////////////
// action = {type: "" ,payload: ...}

const reducer = (state: StateInterface, action: {type:string, payload:any}) => {
    let newState;
    switch(action.type) {
        case "login":
            newState = {...state, ...action.payload}
            cookies.set("jwt_authorization",newState.token)
            cookies.set("username",newState.username)
            cookies.set("user_id",newState.user_id)
            return newState
        case "logout":
            cookies.remove("jwt_authorization")
            cookies.remove("username")
            cookies.remove("user_id")
            cookies.remove("selected_post_id")
            break
        case "setpost":
            newState = {...state, ...action.payload}
            cookies.set("selected_post_id",newState.selected_post_id)
            return newState
        case "setcomment":
            newState = {...state, ...action.payload}
            return newState
        default:
            return state
    }
}

////////////////////
// AppContext
///////////////////

type AppContextProviderProps = {
    children: React.ReactNode
}
type AppContextType = {
    state: typeof initialState
    dispatch: React.Dispatch<{
        type: string;
        payload: any
    }>
}
const AppContext = React.createContext({} as AppContextType)

export const AppState = ({children}: AppContextProviderProps) => {
    const [state,dispatch] = useReducer(reducer, initialState);
    return <AppContext.Provider value = {{state,dispatch}}>
        {children}
    </AppContext.Provider>
}

////////////////
// useAppState
///////////////

export const useAppState = () => {
    return useContext(AppContext)
}