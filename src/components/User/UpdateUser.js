import React, {useState, useEffect, useCallback} from "react";
import { RefreshToken,  DeleteWithAuth } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./UpdateUser.scss";
import axios from "axios";

function UpdateUser(props) {
    const {avatarLink, userId, userName, userEmail} = props;
    const [newAvatarLink, setNewAvatarLink] = useState("")
    const [newUserName, setNewUserName] = useState("")
    const [newUserEmail, setNewUserEmail] = useState("")
    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        navigate("/");
    }


    const handleUserName = (value) => {
        if (value ===null) {
            console.log(value,"--",userName)
            setNewUserName(userName.toString())  
        }
        setNewUserName(value)
    } 

    const handleUserEmail = (value) => {
        if (value ==="") {
            setNewUserEmail(userEmail)  
        }
        setNewUserEmail(value)
    } 

    const handleAvatarLink = (value) => {
        if (value ==="") {
            setNewAvatarLink(avatarLink)  
        }
        setNewAvatarLink(value)
    } 

    const deleteUser = () => {
        DeleteWithAuth("/api/v1/users/"+localStorage.getItem("currentUser"))
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
            },
            (error) => {
                console.log(error)
            }
        )
    }

    axios.interceptors.request.use(
        config => {
            config.headers.authorization = localStorage.getItem("tokenKey");
            config.headers["Content-Type"] = "application/json";
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    )


    const deleteUserAxios =  useCallback(async(userID) => {
        try {
            await axios.delete(`/api/v1/users/${userID}`);
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
                        deleteUserAxios(localStorage.getItem("currentUser"));
                        // setCommentRefresh();
                    }})
                .catch((err) => {
                    console.log("err:",err)
                })
            }
        }
    })


    const updateUserAxios =  useCallback(async() => {
        try {
            const result = await axios.put(`/api/v1/users/`+localStorage.getItem("currentUser"),
                {
                    userName: newUserName,
                    userEmail: newUserEmail,
                    avatarLink: newAvatarLink,
                }
                
                );
            console.log("status:",result.status)
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
                        updateUserAxios();
                        // setCommentRefresh();
                    }})
                .catch((err) => {
                    console.log("err:",err)
                })
            }
        }
    })

    // const saveUpdatedUser = () => {
    //     PutWithAuth("/api/v1/users/"+localStorage.getItem("currentUser"), {
    //         userName: newUserName,
    //         userEmail: newUserEmail,
    //         avatarLink: newAvatarLink,
    //     })
    //       .then((res) => res.json())
    //       .catch((err) => console.log(err))
    // }

    const handleDeleteUser = (e) => {
        deleteUser();
        // deleteUserAxios(localStorage.getItem("currentUser"));
        Swal.fire({
            title: "User successfully deleted!",
            icon: "info"
          });
        logout();
        navigate("/");
        // e.preventDefault();
      }
      

    const handleUpdateUser = (e) => {
        updateUserAxios();
        Swal.fire({
            title: "User successfully updated!",
            icon: "success"
          });
        
        
        // e.preventDefault();
      }



    return(
        <div className='update-user-div'>
            <form className="update-form" onSubmit={handleUpdateUser}>
                <label htmlFor="username">Username:</label>
                <input 
                    value={newUserName}
                    onChange={(e) => handleUserName(e.target.value)}
                    type="text" 
                    placeholder={userName}
                    id="username" 
                    name="username" 
                />

                <label htmlFor="useremail">User E-mail:</label>
                <input 
                    value={newUserEmail}
                    onChange={(e) => handleUserEmail(e.target.value)}
                    type="text" 
                    placeholder={userEmail}
                    id="useremail" 
                    name="useremail" 
                />

                <label htmlFor="avatarlink">Avatar Link:</label>
                <input 
                    value={newAvatarLink}
                    onChange={(e) => handleAvatarLink(e.target.value)}
                    type="text" 
                    placeholder={avatarLink}
                    id="avatarlink" 
                    name="avatarlink" 
                />
               
                <button type="submit">Update</button>
            </form>

            <form onSubmit={handleDeleteUser}>
                <button id="delete-user" type="submit">Delete Account</button>

            </form >
        </div>
    )
}

export default UpdateUser;