import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import M from 'materialize-css';
import ProgressBar from '../../loading/progress/progressbar';


// style
const P = styled.p`
    font-size: 18px;
`
const Title = styled.h1`
    background: linear-gradient(to right, #fa7e1e, #d62976, #962fbf, #4f5bd5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Grand Hotel', cursive;
    font-size: 50px;
    height: 70px;
`
const SignUpCard = styled.div`
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
const BtnSignUp = styled.button`
    margin: 20px;
    width: 30%;
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
const BtnSignIn = styled.button`
    margin-left: 5px;
    margin-bottom: 1px;
    font-weight: 600;
    box-shadow: none;
    transition: 0.5s;
    text-transform: capitalize;
    box-shadow: none !important;
    &:hover{
        color:#1565c0  ;
        box-shadow: none;
    }
    &:focus{
        color:#1565c0  ;
        box-shadow: none;
    }
`


/////
const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const textInput = useRef(null);


    useEffect(() => {
        textInput.current.focus();
    }, [])

    const postData = () => {
        if (!name || !email || !password || !confirmPass) {
            return M.toast({ html: 'Please fill in all fields!', classes: "#e57373 red lighten-2", displayLength: 3000 });
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({ html: 'Invalid email, please try a valid email!', classes: "#e57373 red lighten-2", displayLength: 3000 });
        }

        if (password.length < 6) {
            return M.toast({ html: 'Password is at least 6 character', classes: "#e57373 red lighten-2", displayLength: 3000 });
        }

        if (confirmPass !== password) {
            return M.toast({ html: 'Password is not match', classes: "#e57373 red lighten-2", displayLength: 3000 });
        }

        setLoading(false);

        axios.post('/signup', {
            name: name,
            email: email,
            password: password
        })
            .then((res) => {
                if (res.data.err) {
                    setLoading(true);
                    return M.toast({ html: res.data.err, classes: "#e57373 red lighten-2", displayLength: 3000 })
                }
                M.toast({ html: res.data.msg, classes: "#42a5f5 blue lighten-1", displayLength: 3000 });
                M.toast({ html: res.data.msg2, classes: "#42a5f5 blue lighten-1", displayLength: 3000 });
                history.push('/login');

                setName("");
                setEmail("");
                setPassword("");
                setConfirmPass("");
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

            <SignUpCard className="card">
                <Title>Sign Up</Title>
                <Input type="email"
                    className="form"
                    placeholder="Name..."
                    ref={textInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input type="email"
                    className="form"
                    placeholder="Email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    type="password"
                    className="form"
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                    type="password"
                    className="form"
                    placeholder="Confirm password..."
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                />

                <div><BtnSignUp className="waves-effect waves-light btn #1e88e5 blue darken-1" type="submit" onClick={() => { postData() }} disabled={!loading}>Register</BtnSignUp></div>

                <P>You have an account?<BtnSignIn className="btn waves-effect waves-light #ffffff white" onClick={() => history.push('/login')}>Sign In</BtnSignIn>
                </P>
            </SignUpCard>
        </div>
    );
}

export default SignUp;