
export const initialState = JSON.parse(localStorage.getItem('user'));


export const reducer = (state = initialState, action) => {
    if (action.type === "USERLOGIN") {
        return action.payload
    }

    if (action.type === "LOGOUT") {
        return null;
    }

    if (action.type === "FOLLOWSTT") {
        return {
            ...state,
            status: action.payload.status
        };
    }

    if (action.type === "UPDATEDATAUSER") {
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following,
        }
    }

    if (action.type === "UPDATEAVATAR") {
        return {
            ...state,
            avatar: action.payload
        }
    }

    return state;
}