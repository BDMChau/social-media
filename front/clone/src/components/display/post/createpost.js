import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import M from 'materialize-css';
import Progress from '../../loading/progress/progressbar';

// style
const Title = styled.h1`
    background: linear-gradient(to right, #fa7e1e, #d62976, #962fbf, #4f5bd5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Grand Hotel', cursive;
    font-size: 50px;
    height: 70px;
`
const CreateCard = styled.div`
    padding: 20px;
    text-align: center;
    max-width: 1200px;
    width: 400px;
    position: absolute !important;
    top: 30%;
`
const Input = styled.input`
    box-shadow: 0 1px 0 0 #42a5f5 !important;
    border-bottom: none !important;
    border-radius: 3px;
    margin-top: 5px !important;
    text-indent: 5px;
    font-size: 20px !important;
    &:focus{
        box-shadow: 0 3px 0 0 #42a5f5 !important;
    }
`
const TextArea = styled.textarea`
    border: none !important;
    box-shadow: 0 1px 0 0 #42a5f5 !important;
    border-radius: 0px;
    margin-top: 5px !important;
    height: 50px;
    text-indent: 5px;
    font-size: 20px !important;
    transition: 0.2s;
    &:focus{
        border-bottom: none  !important;
        box-shadow: 0 3px 0 0 #42a5f5 !important;
        outline: none
    }
`
const BtnSubmit = styled.button`
    margin: 20px;
    width: 30%;
    font-weight: 600;
    color: #ffffff94;
    transition: 0.3s;
    padding: 8px 0px;
    box-shadow: none !important;
    border: none;
    &:hover{
        color: white;
    }
    &:focus{
        color: white;
    }
`


/////
const CreatePost = () => {
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const textInput = useRef(null);

    useEffect(() => {
        textInput.current.focus();
    }, [])

    useEffect(() => {
        axios({
            method: 'post',
            url: '/home/newpost',
            data: {
                body: body,
                photo: imageUrl
            },
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            }
        })
            .then((res) => {
                if (res.data.err) {
                    history.push('/login');
                    return M.toast({ html: res.data.err, classes: "#e57373 red lighten-2", displayLength: 3000 })
                }

                history.push('/');
                setImage("");
                setBody("");
            })
            .catch((err) => {
                console.log(err);
            })
    }, [imageUrl])


    const postImg = () => {
        var formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "instaClone");
        formData.append("cloudinary_name", "do3l051oy");

        if (!body) {
            return [
                M.toast({ html: "Oh, what is happened with you today?", classes: "#e57373 red lighten-2", displayLength: 3500 }),
                M.toast({ html: "Pls let me know how are you feeling :(", classes: "#e57373 red lighten-2", displayLength: 4000 })
            ]
        } if (!image) {
            M.toast({ html: "Choose your picture", classes: "#e57373 red lighten-2", displayLength: 3500 })

        } else {
            setLoading(false);

            axios({
                method: 'post',
                url: 'https://api.cloudinary.com/v1_1/do3l051oy/image/upload',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then((res) => {
                    setImageUrl(res.data.url);
                })
                .catch((err) => {
                    console.log(err);
                })
        }

    }


    return (
        <div>

            <div className="row">
                {loading
                    ? ''
                    : <Progress />}

                <CreateCard className="card">
                    <Title>What's on your mind?</Title>


                    <TextArea
                        type="text"
                        className="form"
                        placeholder="What's on your mind?"
                        ref={textInput}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    />

                    <div className="file-field input-field">
                        <div className="btn waves-effect waves-light" style={{ background: "#1e88e5", color: "white", fontWeight: "400", padding: "0 20px", textTransform: "none" }}>
                            <span>Image</span>
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <Input
                                className="file-path validate"
                                type="text"
                                placeholder="Upload your image...."
                            />
                        </div>
                    </div>

                    <div><BtnSubmit className="waves-effect waves-light btn #1e88e5 blue darken-1" type="submit" onClick={() => { postImg() }} disabled={!loading}>Post</BtnSubmit></div>

                </CreateCard>
            </div>

        </div>
    );
}

export default CreatePost;