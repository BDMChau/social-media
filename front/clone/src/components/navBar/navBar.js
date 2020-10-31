import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from '../../App';
import M from "materialize-css/dist/js/materialize.min.js";
import axios from 'axios';
import ProgressBar from '../loading/progress/progressbar';

// style
const StyleLink = styled(NavLink)`
    text-decoration: none !important;
    color: #00000057;
    background: transparent !important;
    transition: 0.3s;
    &:hover{
        color: #3c3c3ce0;
        background: #e0e0e0 !important;
    }
    @media (max-width: 768px){
        margin: 25px 0;
    }
`
const Logo = styled(NavLink)`
    margin-left: 35px;
    color: black !important;
    background: linear-gradient(to right, #fa7e1e, #d62976, #962fbf, #4f5bd5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Grand Hotel', cursive;
    font-size: 2.5rem !important;
    @media (max-width: 768px) {
        margin-left: 0;
      }
`
const Input = styled.input`
    width: 100% !important;
    border-bottom: 1px solid #a5a5a5!important;   
    box-shadow: none !important;
    border-radius: 3px;
    margin-top: 5px !important;
    text-indent: 5px;
    font-size: 20px !important;
    transition: 0.3s !important;
    word-wrap: break-word;
    opacity: 0.7;
    &:focus{    
        opacity: 1;
    }
`
const Modal = styled.div`
    width: 40%;
    height: 40%;
    overflow: auto;
    ::-webkit-scrollbar {
        width: 5px;
    }
    ::-webkit-scrollbar-thumb {
        background: transparent; 
    }
    ::-webkit-scrollbar-thumb:hover {
        background: transparent; 
    }
    @media (max-width: 768px) {
        width: 80%;
        height: 45%;
    }
`
const Btn = styled.button`
    margin: 20px;
    width: 25%;
    font-weight: 600;
    color: #585858;
    transition: 0.3s;
    text-transform: capitalize;
    box-shadow: none !important;
    &:hover{
        color: black;
    }
    &:focus{
        color: black;
    }
`
const SearchItem = styled.div`
    
`

/////////////
const NavBar = () => {
    const { dispatch, state } = useContext(UserContext);
    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const modalRef = useRef(null);
    const typingRef = useRef(null);
    const history = useHistory();

    // responsive navbar and modal reference with materialize
    useEffect(() => {
        let elem = document.querySelector(".sidenav");
        M.Sidenav.init(elem, {
            edge: "left",
            inDuration: 250
        });

        M.Modal.init(modalRef.current);
    }, []);

    const handleSearch = (val) => {
        setSearchValue(val);

        if (typingRef.current) {
            clearTimeout(typingRef.current);
        }

        if (val) {
            typingRef.current = setTimeout(() => {
                axios({
                    method: 'post',
                    url: '/user/search',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": JSON.parse(localStorage.getItem("token"))
                    },
                    data: {
                        query: val
                    }
                })
                    .then((res) => {
                        setSearchResult(res.data.users);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }, 300)
        } else {
            setSearchResult([]);
        }

    }

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        localStorage.clear();
    }

    const closeModal = () => {
        M.Modal.getInstance(modalRef.current).close();
        setSearchValue('');
        setSearchResult([])
    }


    const renderItem = () => {
        if (state) {
            return [
                <li>
                    <StyleLink to="#" data-target="modal1" className="modal-trigger" title="Search"><i className="material-icons" style={{ fontSize: "30px" }}>search</i></StyleLink>
                </li>,
                <li>
                    <StyleLink to="/" title="New Feed"><i className="material-icons" style={{ fontSize: "30px" }}>explore</i></StyleLink>
                </li>,
                <li>
                    <StyleLink to="/followposts" title="Following"><i className="material-icons" style={{ fontSize: "30px" }}>supervised_user_circle</i></StyleLink>
                </li>,
                <li>
                    <StyleLink to="/profile" title="Profile"><i className="material-icons" style={{ fontSize: "30px" }}>account_circle</i></StyleLink>
                </li>,
                <li>
                    <StyleLink to="/createpost" title="Create Post"><i className="material-icons" style={{ fontSize: "30px" }}>create</i></StyleLink>
                </li>,
                <li>
                    <StyleLink to="/login" onClick={() => handleLogout()} title="Log Out"><i className="material-icons" style={{ fontSize: "30px" }}>arrow_forward</i></StyleLink>
                </li>
            ]
        } else {
            return [
                <li>
                    <StyleLink to="/login" onClick={() => handleLogout()}><i className="material-icons" style={{ fontSize: "30px" }}>login</i></StyleLink>
                </li>
            ]
        }
    }

    const renderSearchResult = () => {
        return (
            searchResult
                ? searchResult.map((user) => {
                    return (
                        user.name
                            ? (
                                <SearchItem>
                                    <StyleLink
                                        to={user._id === state._id ? "/profile" : "/profile/" + user._id}
                                        className="collection-item" style={{ color: 'black' }}
                                        onClick={() => console.log(user._id)}
                                    >
                                        {user.name}
                                    </StyleLink>

                                    <p className="collection-item" style={{ color: 'black' }}>{user.email}</p>
                                </SearchItem>
                            )
                            : <h5 style={{ textAlign: 'center' }}>{user}</h5>
                    )
                })
                : ''
        )
    }


    return (
        <div>
            <nav className="nav-extended white">
                <div className="nav-wrapper">
                    <Logo to={state ? "/" : "/login"} className="brand-logo">Social Media</Logo>
                    <StyleLink
                        to="#"
                        className="sidenav-trigger right"
                        data-target="mobile-nav"
                        style={{ marginRight: "20px" }}
                    >
                        <i className="material-icons" style={{ fontSize: "40px" }}>arrow_drop_down</i>
                    </StyleLink>

                    <ul id="nav-mobile" className="right hide-on-med-and-down" >
                        {renderItem()}
                    </ul>
                </div>

                <Modal id="modal1" className="modal" ref={modalRef}>
                    <div className="modal-content" style={{ color: 'black' }}>
                        <Input
                            type="text"
                            className="form"
                            placeholder="Search"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchResult.length
                            ? <div className="collection" style={{ border: 'none' }}>
                                {renderSearchResult()}
                            </div>

                            : <ProgressBar />
                        }
                    </div>

                    <div className="modal-footer">
                        <Btn
                            className="modal-close btn waves-effect waves-light #fafafa grey lighten-5"
                            type="button"
                            tyle={{ textTransform: 'capitalize', fontWeight: '500' }}
                            onClick={() => closeModal()}
                        >
                            Cancle
                        </Btn>
                    </div>
                </Modal>
            </nav>

            <ul className="sidenav" id="mobile-nav" style={{ width: "7rem" }}>
                {renderItem()}
            </ul>
        </div>
    );
}

export default NavBar;