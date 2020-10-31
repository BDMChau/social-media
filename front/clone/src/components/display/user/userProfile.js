import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { UserContext } from '../../../App';
import { useParams } from 'react-router-dom'
import Loading from '../../loading/point/pointloading';

// style
const Avatar = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    background-position: center;
    background-size: cover;
    top: 0;
    left: 0;
    right: 0;
    @media (max-width: 375px) {
        width: 100%;
        height: 100%;
    }
`
const ImgItem = styled.div`
    width: 30%;
    margin-bottom: 30px;
    margin-left: 25px;
    height: 285px;
    background-position: center;
    background-size: cover;
    @media (max-width: 375px) {
        height: 100px;
        margin-bottom: 11px;
        margin-left: 11px;
    }
    @media (min-width: 376px) and (max-width: 768px) {
        height: 180px;
        margin-bottom: 15px;
        margin-left: 15px;
    }
`
const AvatarForm = styled.div`
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 0 70px 0;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    &:focus{
        outline: none;
    }
    @media (max-width: 415px) {
        width: 100px;
        height: 100px;
    }
`



const UserProfile = (props) => {
    const [userData, setUserData] = useState('');
    const { state, dispatch } = useContext(UserContext);
    const { userId } = useParams();
    const [followStt, setFollowStt] = useState(state ? !state.following.includes(userId) : true);


    useEffect(() => {
        axios({
            method: 'get',
            url: `/user/${userId}`,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            }
        })
            .then((res) => {
                setUserData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    const followUser = () => {
        axios({
            method: 'put',
            url: "/user/follow",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            },
            data: {
                followId: userId
            }
        })
            .then((res) => {
                console.log(res.data);
                dispatch({
                    type: "UPDATEDATAUSER",
                    payload: {
                        followers: res.data.followers,
                        following: res.data.following
                    }
                })
                localStorage.setItem('user', JSON.stringify(res.data));

                setUserData((prevData) => {
                    return {
                        ...prevData,
                        user: {
                            ...prevData.user,
                            followers: [...prevData.user.followers, res.data._id]
                        }
                    }
                })

                setFollowStt(false);
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const unFollowUser = () => {
        axios({
            method: 'put',
            url: "/user/unfollow",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            },
            data: {
                unFollowId: userId
            }
        })
            .then((res) => {
                dispatch({
                    type: "UPDATEDATAUSER",
                    payload: {
                        followers: res.data.followers,
                        following: res.data.following
                    }
                })
                localStorage.setItem('user', JSON.stringify(res.data));

                setUserData((prevData) => {
                    const unFollow = prevData.user.followers.filter((user) => user !== res.data._id)
                    return {
                        ...prevData,
                        user: {
                            ...prevData.user,
                            followers: unFollow
                        }
                    }
                })

                setFollowStt(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }



    return (
        <div>
            {userData
                ? <div className="container">
                    <div className="info" style={{
                        display: "flex",
                        justifyContent: "space-around",
                        borderBottom: "1px solid #0000003d",
                        margin: "50px auto 50px auto",
                        maxWidth: "940px"
                    }}>

                        <AvatarForm className="avatar-form">
                            <Avatar style={{ backgroundImage: `url(${userData.user ? userData.user.avatar : "https://res.cloudinary.com/do3l051oy/image/upload/v1594380419/user-2517433_960_720_zj8jxr.png"})` }} alt="Add avatar" />
                        </AvatarForm>

                        <div style={{ margin: "0 5% 0 0" }}>
                            <h1>{userData.user.name}</h1>
                            <div style={{ width: "109%", display: "flex", justifyContent: "space-between" }}>
                                {userData.posts.length} {userData.posts.length > 1 ? <p>posts</p> : <p>post</p>}
                                <p>{userData.user.followers.length} followers</p>
                                <p>{userData.user.following.length} following</p>

                            </div>
                            {followStt
                                ? <button className="btn" onClick={() => followUser()}>follow</button>
                                : <button className="btn" onClick={() => unFollowUser()}>unfollow</button>
                            }
                        </div>
                    </div>
                    <div className="gallery" style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        maxWidth: "930px",
                        margin: "auto",
                    }}>
                        {userData.posts.length > 0
                            ? userData.posts.map((mypost, key) => {
                                return (
                                    <ImgItem key={key} alt="" style={{ backgroundImage: `url(${mypost.photo})` }} />
                                )
                            })
                            : <p style={{ margin: "auto", fontSize: '24px', fontWeight: '300' }}>No Post Yet!</p>
                        }
                    </div>
                </div>
                : <Loading />
            }
        </div>
    );
}

export default UserProfile;