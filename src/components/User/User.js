import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./User.scss";
import { RefreshToken } from "../../services/HttpService";
import UpdateUser from "./UpdateUser";
import UserActivity from "./UserActivity";
import axios from "axios";

function User() {
    // get param from app.js
    const { userId} = useParams();
    const [user, setUser] = useState();
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const [isUserActivityLoaded, setIsUserActivityLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [userList, setUserList] = useState([]);
    const [userActivitiyList, setUserActivityList] = useState([]);

    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        navigate("/");
    }


    // axios.interceptors.request.use(
    //     config => {
    //         config.headers.authorization = localStorage.getItem("tokenKey");
    //         return config;
    //     },
    //     error => {
    //         return Promise.reject(error);
    //     }
    // )

    const getUserAxios =  useCallback(async() => {
        try {
            const result = await axios.get(`/api/v1/users/`+userId);
            console.log("status:",result.status)
            console.log(result);
            setIsUserLoaded(true);
            setUser(result);
        }
        catch(err) {
            if(err.response.status === 401) {
                console.log("err status:",err.response.status)
                RefreshToken()
                .then((res) => { 
                    if(!res.ok) {
                        logout();
                    } else {
                        return res.json()
                    }})
                .then((result) => {
                    console.log("401 result:", result)
                    if(result != undefined){
                        console.log("token is refreshed!")
                        localStorage.setItem("tokenKey",result.accessToken);
                        getUserAxios();
                        // setCommentRefresh();
                    }})
                .catch((err) => {
                    console.log("err:",err)
                    setError(err)
                })
            }
        }
    })

    // const getUser = async() => {
    //     GetWithAuth("/api/v1/users/"+userId)
    //     .then(res => res.json())
    //     .then(
    //         (result) => {
    //             console.log(result);
    //             setIsUserLoaded(true);
    //             setUser(result);
    //         },
    //         (error) => {
    //             setIsUserLoaded(true);
    //             console.log(error)
    //         }
    //     )
    // }

 

    useEffect(() => {
        getUserAxios();
        console.log("user log:",user);
        console.log(isUserLoaded)
        
        // getAllUsers()
        // console.log("userlist log:",userList)
    }, [])

    const dateConverter = (prevDate) => {
        console.log(prevDate)
        let objectDate = new Date(prevDate);
        let day = objectDate.getDate();
        let month = objectDate.getMonth() +1;
        let year = objectDate.getFullYear();
        let hours = objectDate.getHours();
        let minutes = objectDate.getMinutes();
        return hours+":"+minutes+"    "+day+"/"+month+"/"+year;
    }
    
    

    
    if(error) {
        return(<div>Error while loading user!</div>)
    }
    else if (!isUserLoaded) {
        return(<div>Loading!</div>)
    }
    else if (isUserLoaded) {
        return(
            <div class="user-page">
                <Container>
                <Row>
                    <Col id="user-page-left" sm={4}>
                        <img src="/avatars/avatar_0.png" alt="Italian Trulli"></img>
                    </Col>

                    <Col id="user-page-right" sm={8}>
                        <div class="user-title">
                            <h2>{user.data.userName}</h2>
                            <p><i>#{userId}</i></p>
                        </div>
                        <div class="user-notifications ">
                            <h5>Details</h5>
                            <p>E-Mail: {user.data.userEmail}</p>
                            <p>Member Since: {dateConverter(user.data.registerDate)}</p>
                        </div>

                        {
                            (localStorage.getItem("currentUser") !== userId) ?
                            ""
                            :
                            <div>
                                <div class="user-notifications">
                                    <h5>Notifications</h5>
                                    <UserActivity userId={userId} />
                                </div>
                                <div class="user-notifications">
                                <h5>Update User</h5>
                                    <UpdateUser
                                        userName= {user.data.userName}
                                        userEmail = {user.data.userEmail}
                                        avatarLink = {user.data.avatarLink}
                                    >
                                    </UpdateUser>
                                </div>
                            </div>
                        }
                    </Col>
                </Row>
            </Container>
            </div>
        )
        
    }

    
}

export default User;