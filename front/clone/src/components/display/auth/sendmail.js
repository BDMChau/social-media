import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import M from 'materialize-css';
import ProgressBar from '../../loading/progress/progressbar';


// style
const Title = styled.h1`
    background: linear-gradient(to right, #fa7e1e, #d62976, #962fbf, #4f5bd5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Grand Hotel', cursive;
    font-size: 50px;
    height: 70px;
`
const LoginCard = styled.div`
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
const Btn = styled.button`
    margin: 20px 10px 20px 10px;
    width: 42%;
    font-weight: 600;
    color: #ffffff94;
    transition: 0.3s;
    text-transform: capitalize;
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
const SendEmail = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const history = useHistory();


    const handleSendEmail = () => {
        setLoading(false);

        axios({
            method: 'post',
            url: '/sendemail',
            data: {
                email: email
            },
            headers: {
                'Content-Type': 'application/json',
                "Authorization": JSON.parse(localStorage.getItem("token"))
            }
        })
            .then((res) => {
                setLoading(true);
                M.toast({ html: res.data, classes: "#42a5f5 blue lighten-1", displayLength: 4000 });
            })
            .catch((err) => {
                console.log(err);
            })

    }

    return (
        <div className="row">
            {loading
                ? ''
                : <ProgressBar />
            }

            <LoginCard className="card">
                <Title>Social Media</Title>
                <Input
                    type="email"
                    className="form"
                    placeholder="Type your email to reset password"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div>
                    <Btn className="waves-effect waves-light btn #1e88e5 blue darken-1" type="button" onClick={() => { handleSendEmail() }} disabled={!loading}>Submit</Btn>
                    <Btn className="btn waves-effect waves-light btn #ef5350 red lighten-1" type="button" onClick={() => history.push('/login')}>Cancel</Btn>
                </div>

            </LoginCard>
        </div>
    );
}

export default SendEmail;