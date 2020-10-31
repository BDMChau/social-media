import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useHistory, NavLink } from "react-router-dom";
import M from 'materialize-css';
import { UserContext } from '../../../App';
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
const BtnLogin = styled.button`
    margin: 20px;
    width: 30%;
    font-weight: 600;
    color: #ffffff94;
    transition: 0.3s;
    text-transform: capitalize;
    box-shadow: none !important;
    box-shadow: none !important;
    border: none;
    &:hover{
        color: white;
    }
    &:focus{
        color: white;
    }
`
const BtnSignUp = styled.button`
    margin-left: 5px;
    margin-bottom: 1px;
    font-weight: 600;
    box-shadow: none;
    transition: 0.5s;
    text-transform: capitalize;
    box-shadow: none !important;
    &:hover{
        color:#1565c0;
        box-shadow: none;
    }
    &:focus{
        color:#1565c0 ;
        box-shadow: none;
    }
`


/////
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const { dispatch } = useContext(UserContext);
    const textInput = useRef(null);

    useEffect(() => {
        textInput.current.focus();
    }, [])

    const postData = () => {

        if (!email || !password) {
            return M.toast({ html: 'Missing credentials!', classes: "#e57373 red lighten-2", displayLength: 3000 });
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({ html: 'Invalid email, please try a valid email!', classes: "#e57373 red lighten-2", displayLength: 3000 });
        }


        if (localStorage.getItem('user')) {
            return M.toast({ html: "please log out first!", classes: "#e57373 red lighten-2", displayLength: 3000 });
        }


        axios.post('/signin', {
            email: email,
            password: password
        })
            .then((res) => {
                if (res.data.err) {
                    setLoading(true);
                    return M.toast({ html: res.data.err, classes: "#e57373 red lighten-2", displayLength: 3000 });
                }

                localStorage.setItem('token', JSON.stringify(res.data.userToken));
                localStorage.setItem('user', JSON.stringify(res.data.user));
                dispatch({ type: "USERLOGIN", payload: res.data.user });

                M.toast({ html: res.data.msg, classes: "#42a5f5 blue lighten-1", displayLength: 3000 });
                history.push('/');

                setEmail("");
                setPassword("");
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
                    placeholder="Email..."
                    ref={textInput}
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

                <div><BtnLogin className="waves-effect waves-light btn #1e88e5 blue darken-1" type="button" onClick={() => { postData() }} disabled={!loading}>Login</BtnLogin></div>

                <P>You don't have account?<BtnSignUp className="btn waves-effect waves-light #ffffff white" type="button" onClick={() => history.push('/signup')}>Sign Up</BtnSignUp>
                </P>
                <NavLink to="/requestemail">
                    <BtnSignUp className="btn waves-effect waves-light #ffffff white" type="button" style={{ textTransform: 'capitalize', fontWeight: '500' }}>Forgot password</BtnSignUp>
                </NavLink>

            </LoginCard>
        </div>
    );
}

export default Login;