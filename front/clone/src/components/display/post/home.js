import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import like from "../../../assets/img/like.svg"
import unlike from "../../../assets/img/unlike.svg"
import { UserContext } from '../../../App';
import M from 'materialize-css';
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import PointLoading from '../../loading/point/pointloading';


// style
const Card = styled.div`
    max-width: 600px;
    margin: 50px auto
`
const Img = styled.img`
    width: 100%;
`
const Input = styled.input`
    border-bottom: 1px solid #00000042 !important;
    text-indent: 5px;
    &:focus {
        box-shadow: none !important;
    }
`
const TitleAuthor = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: flex-start !important;
    height: 50px;
    margin: 0 0 0 20px;
`
const ImgStt = styled.img`
    width: 22px;
    margin-bottom: 10px;
    margin-top: -6px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
        transform: scale(1.2);
    }
`
const StyleLink = styled(NavLink)`
    text-decoration: none !important;
    color: black !important;
    transition: 0.3s !important;

`
const Avatar = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 10px 7px 0 ;
    background-position: center;
    background-size: cover;
`


//////////
const Home = () => {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    const [userLike, setuserLike] = useState(false);
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory()

    useEffect(() => {
        if (state) {
            history.push('/');
        } else {
            history.push('/login')
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        
        axios({
            method: 'get',
            url: '/home/explorer',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            }
        })
            .then((res) => {
                setData(res.data.posts);
                setLoading(false);

            })
            .catch((err) => {
                console.log(err);
            })

    }, []);

    const handleLikePost = (id) => {
        setuserLike(true);

        axios({
            method: 'put',
            url: '/home/like',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            },
            data: JSON.stringify({
                postId: id
            })
        })
            .then((res) => {
                const updateData = data.map((post) => {
                    if (post._id === res.data._id) {
                        return res.data
                    } else {
                        return post;
                    }
                })
                setData(updateData);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleUnlikePost = (id) => {
        setuserLike(false);

        axios({
            method: 'put',
            url: '/home/unlike',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            },
            data: JSON.stringify({
                postId: id
            })
        })
            .then((res) => {
                const updateData = data.map((post) => {
                    if (post._id === res.data._id) {
                        return res.data
                    } else {
                        return post;
                    }
                })
                setData(updateData);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleComment = (text, postId) => {
        axios({
            method: 'put',
            url: '/home/comment',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            },
            data: JSON.stringify({
                text: text,
                postId: postId
            })
        })
            .then((res) => {
                const updateData = data.map((post) => {
                    if (post._id === res.data._id) {
                        return res.data
                    } else {
                        return post;
                    }
                })
                setData(updateData);
            })
            .catch((err) => {
                console.log(err);
            })

        setComment("");
    }

    const handleRemovePost = (postId) => {
        axios({
            method: 'delete',
            url: `/home/remove/${postId}`,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            }
        })
            .then((res) => {
                console.log(res.data);
                const updateData = data.filter((post) => {
                    return post._id !== res.data._id;
                })

                setData(updateData);
                M.toast({ html: "Removed successfully!", classes: "#42a5f5 blue lighten-1", displayLength: 3000 });

            })
            .catch((err) => {
                console.log(err);
            })
    }


    return (
        <div>
            {loading ? <PointLoading /> : ''}

            <div className="home-page container">
                {
                    (data.map((post) => {
                        return (
                            <Card className="card" key={post._id}>
                                <TitleAuthor className="title-author" style={{ justifyContent: "space-between" }}>
                                    <StyleLink to={post.by._id === state._id ? "/profile" : "/profile/" + post.by._id}>
                                        <Avatar alt="" style={{ backgroundImage: `url(${post.by.avatar ? post.by.avatar : 'https://res.cloudinary.com/do3l051oy/image/upload/v1594380419/user-2517433_960_720_zj8jxr.png'} )` }} />
                                    </StyleLink>

                                    <h5 style={{ textDecoration: "none", marginBottom: '11px' }}>
                                        <StyleLink to={post.by._id === state._id ? "/profile" : "/profile/" + post.by._id}> {post.by.name} </StyleLink>
                                    </h5>
                                    {post.by._id === state._id
                                        ? <span className="material-icons" style={{ margin: "-10px 5px 12px 0px", cursor: "pointer", position: 'absolute', right: '0' }} onClick={() => handleRemovePost(post._id)} >clear</span>
                                        : ''
                                    }
                                </TitleAuthor>

                                <div className="card-img">
                                    <Img src={post.photo} alt="" />
                                </div>

                                <div className="card-content">
                                    {post.like.includes(state._id) || userLike
                                        ? <ImgStt src={like} onClick={() => handleUnlikePost(post._id)} alt="" />
                                        : <ImgStt src={unlike} onClick={() => handleLikePost(post._id)} alt="" />
                                    }

                                    <h6>{post.like.length || 0} likes</h6>
                                    <p><b>{post.by.name}</b> {post.body}</p>
                                    <br />
                                    <div className="comment-box">
                                        <div className="comment-content">
                                            {post.comment.map((cmt) => {
                                                return (
                                                    <p key={cmt._id} ><b>{cmt.by.name}</b> {cmt.text}</p>
                                                )
                                            })}
                                        </div>

                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleComment(comment, post._id)
                                        }}>
                                            <Input
                                                id={post._id}
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </form>
                                    </div>
                                </div>
                            </Card>
                        )
                    }))
                }
            </div>
        </div>
    );
}

export default Home;