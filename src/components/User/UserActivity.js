import React, { useCallback, useEffect, useState } from "react";
import { RefreshToken } from "../../services/HttpService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserActivity(props) {
    const {userId} = props;
    const [isUserActivityLoaded, setIsUserActivityLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [userActivitiyList, setUserActivityList] = useState([]);
    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        navigate("/");
    }


    const getUserActivityAxios =  useCallback(async() => {
        try {
            const result = await axios.get(`/api/v1/users/activity/`+userId);
            console.log("status:",result.status)
            console.log("activity result",result.data);
            setIsUserActivityLoaded(true);
            setUserActivityList(result.data)
            
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
                        getUserActivityAxios();
                        // setCommentRefresh();
                    }})
                .catch((err) => {
                    console.log("err:",err)
                    setError(err)
                })
            }
        }
    })

    // const getUserActivity  = () => {
    //     fetch("/api/v1/users/activity/"+userId, {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization" : localStorage.getItem("tokenKey"),
    //         },
    //       })
    //       .then(res => res.json())
    //       .then(
    //         (result) => {
    //             setIsUserActivityLoaded(true);
    //             console.log("activity result",result);
    //             setUserActivityList(result)
    //         },
    //         (error) => {
    //             console.log(error)
    //             setIsUserActivityLoaded(true);
    //             setError("error:",error);
                
    //         }
    //     )
    // }

    useEffect(() => {
        getUserActivityAxios()
    }, [])

    if(userActivitiyList.length === 0) {
        return(
        <div class="user-notifications">
            <ul>
                <li>You do not have notifications!</li>
            </ul>
        </div>
        )
    }

    else{
        return(
            <div class="user-notifications">
                <ul>
                {userActivitiyList.map((row) => {
                    return (
                        <li>
                        {row[2] + " " + row[0] + " your post!"}
                        </li>
                    );
                })
              }
              </ul>
            </div>
        )
    }




    


    
}

export default UserActivity;