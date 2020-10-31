import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { UserContext } from '../../../App';
import PointLoading from '../../loading/point/pointloading';
import { Dropdown } from 'react-bootstrap';
import {defaultAvatar} from '../../../utils/defaultAvatar';
import CircleLoading from '../../loading/circle/circleloading';

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
    height: 285px;
    margin-bottom: 30px;
    margin-left: 25px;
    background-position: center;
    background-size: cover;
    @media (max-width: 415px) {
        height: 100px;
        margin-bottom: 11px;
        margin-left: 11px;
    }
    @media (min-width: 416px) and (max-width: 768px) {
        height: 180px;
        margin-bottom: 15px;
        margin-left: 15px;
    }
`
const Input = styled.input`
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 0;
    cursor: pointer;
    border-radius: 50%;
    opacity: 0;
    z-index: 99;
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
const DropdownBtn = styled(Dropdown.Toggle)`
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 0;
    cursor: pointer;
    border-radius: 50%;
    opacity: 0;
    z-index: 99;
`
const DropdownItem = styled(Dropdown.Item)`
    width: 100%;
    font-weight: 500;
    color: #585858;
    transition: 0.3s;
    text-transform: capitalize;
    box-shadow: none !important;
    border: none;
    background: none;
    text-align: center;
    &:hover{
        color: black;
    }
    &:focus{
        color: black;
        outline: none;
        background: none;
    }
`
const DropdownItem2 = styled.div`
    width: 100%;
    font-weight: 500;
    color: #585858;
    transition: 0.3s;
    text-transform: capitalize;
    box-shadow: none !important;
    border: none;
    background: none;
    text-align: center;
    padding-top: 5px;
    &:hover{
        color: black;
    }
    &:focus{
        color: black;
        outline: none;
        background: none;
    }
`


const Profile = () => {
    const [postData, setPostData] = useState([]);
    const [userData, setUserData] = useState('');
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        axios({
            method: 'get',
            url: '/home/mywall',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            }
        })
            .then((res) => {
                setPostData(res.data.myposts);
            })
            .catch((err) => {
                console.log(err);
            })

        axios({
            method: 'post',
            url: '/home/user',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            },
            data: {
                userId: JSON.parse(localStorage.getItem("user"))
            }
        })
            .then((res) => {
                setUserData(res.data.user)
            })
            .catch((err) => {
                console.log(err);
            })

    }, []);


    const postImgAvatar = (img) => {
        setLoading(true);
        var formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", "instaClone");
        formData.append("cloudinary_name", "do3l051oy");

        axios({
            method: 'post',
            url: 'https://api.cloudinary.com/v1_1/do3l051oy/image/upload',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                axios({
                    method: 'put',
                    url: '/user/avatar',
                    data: JSON.stringify({
                        avatar: res.data.url
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": JSON.parse(localStorage.getItem("token"))
                    }
                })
                    .then((res) => {
                        localStorage.setItem('user', JSON.stringify({ ...state, avatar: res.data.avatar }));
                        dispatch({ type: "UPDATEAVATAR", payload: res.data.avatar });
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleRemoveAvatar = () => {
        axios({
            method: 'put',
            url: '/user/removeavatar',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            }
        })
            .then((res) => {
                localStorage.setItem('user', JSON.stringify({ ...state, avatar: res.data.avatar }));
                dispatch({ type: "UPDATEAVATAR", payload: res.data.avatar });
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
                            {state.avatar
                                ? <Dropdown style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                    <DropdownBtn variant="success" id="dropdown-basic">
                                        Dropdown Button
                                </DropdownBtn>
                                    <Dropdown.Menu>
                                        <DropdownItem2 title="Add avatar" style={{ position: 'relative' }} >
                                            <Input type="file" title="Change Avatar" onChange={(e) => { postImgAvatar(e.target.files[0]) }} style={{ left: '0', top: '-7px', borderRadius: '0' }} />
                                            Change Avatar
                                            </DropdownItem2>

                                        <div className="line" style={{ border: "1px solid rgba(0, 0, 0, 0.15)", margin: "10px 0" }} ></div>

                                        <DropdownItem title="Remove avatar" onClick={() => handleRemoveAvatar()} >Remove avatar</DropdownItem>
                                    </Dropdown.Menu>
                                </Dropdown>

                                : <Input type="file" title="Add avatar" onChange={(e) => { postImgAvatar(e.target.files[0]) }} />
                            }

                            {loading
                                ? <CircleLoading />
                                : <Avatar style={{ backgroundImage: `url(${state.avatar ? state.avatar : defaultAvatar})` }} alt="Add avatar" />
                            }
                        </AvatarForm>


                        <div style={{ margin: "0 5% 0 0" }}>
                            <h1>{userData.name}</h1>
                            <div style={{ width: "109%", display: "flex", justifyContent: "space-between" }}>
                                {postData.length} {postData.length > 1 ? <p>posts</p> : <p>post</p>}
                                <p>{state.followers.length} followers</p>
                                <p>{state.following.length} following</p>
                            </div>
                        </div>

                    </div>
                    <div className="gallery" style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        maxWidth: "930px",
                        margin: "auto",
                    }}>
                        {postData.length > 0
                            ? postData.map((mypost, key) => {
                                return (
                                    <ImgItem key={key} alt="" style={{ backgroundImage: `url(${mypost.photo})` }} />
                                )
                            })
                            : <p style={{ margin: "auto", fontSize: '24px', fontWeight: '300' }}>You Haven't Post Anything Yet!</p>
                        }
                    </div>
                </div>
                : <PointLoading />

            }
        </div >
    );
}
export default Profile;