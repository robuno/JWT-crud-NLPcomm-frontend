import React, {useState, useEffect, useRef, useCallback} from "react";
import { DeleteWithAuth, RefreshToken } from "../../services/HttpService";
// import { PostWithAuth, DeleteWithAuth, RefreshToken } from "../../services/HttpService";
import { FaRegThumbsUp, FaThumbsUp, FaCommentAlt, FaShareSquare } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import './Post.scss';
import axios from "axios";

function Post(props) {
    const {title, text, userId, userName, postId, createDate, likes} = props;
    const [likeCount, setLikeCount] = useState(likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    let isUserNotLoggedIn = localStorage.getItem("currentUser") == null ? true:false;
    let navigate = useNavigate();

    var userPath = '/users/' + userId;

    let objectDate = new Date(createDate);
    let day = objectDate.getDate();
    let month = objectDate.getMonth() +1;
    let year = objectDate.getFullYear();
    let hours = objectDate.getHours();
    let minutes = objectDate.getMinutes();


    console.log(day+"/"+month+"/"+year); 

    const handleLike = () => {
        setIsLiked(!isLiked);
        if(!isLiked){
            sendLikeAxios();
          setLikeCount(likeCount + 1)
       }
        else{
          deleteLike();
          setLikeCount(likeCount - 1)
       }
    }

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        navigate("/");
    }


    const deleteLike = () => {
        DeleteWithAuth("/api/v1/likes/"+likeId)
        .then((result) => console.log(result))
        .catch((err) => console.log(err))
    }

    const sendLikeAxios =  useCallback(async() => {
        try {
            const result = await axios.post(`/api/v1/likes`,
            {
                postId: postId, 
                userId : localStorage.getItem("currentUser"),
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
                        localStorage.setItem("tokenKey",result.accessToken);
                        sendLikeAxios();
                        // setCommentRefresh();
                    }})
                .catch((err) => {
                    console.log("err:",err)
                })
            }
        }
    })

    // const saveLike = () => {
    //     PostWithAuth("/api/v1/likes",{
    //       postId: postId, 
    //       userId : localStorage.getItem("currentUser"),
    //     })
    //     .then((res) => {
    //         if(!res.ok) {
    //             RefreshToken()
    //             .then((res) => { 
    //             if(!res.ok) {
    //                 logout();
    //             } else {
    //                return res.json()
    //             }})
                
    //             .then((result) => {
    //                 console.log(result)

    //                 if(result !== undefined){
    //                     localStorage.setItem("tokenKey",result.accessToken);
    //                     saveLike();
    //                     // setCommentRefresh();
    //                 }})
    //             .catch((err) => {
    //                 console.log(err)
    //             })
    //         } else 
    //         res.json()
    //     })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    // }

    // // const saveLikeOld = () => {
    // //     PostWithAuth("/api/v1/likes",{
    // //       postId: postId, 
    // //       userId : localStorage.getItem("currentUser"),
    // //     })
    // //       .then((res) => res.json())
    // //       .catch((err) => console.log(err))
    // // }


    const checkLikes = () => {
        var likeControl = likes.find((like =>  ""+like.userId === localStorage.getItem("currentUser")));
        if(likeControl != null){
            setLikeId(likeControl.id);
            setIsLiked(true);
        }
    }


    useEffect(() => {checkLikes()},[])

    return(
        <div class="post-container">
            <Container >
            <Row id="post-row">
                {/* Avatar */}
                <Col id="post-left-side" sm={2}>
                    <img src="/avatars/avatar_0.png" alt="Italian Trulli"></img>
                </Col>
                 {/* Post Text */}
                <Col id="post-main-side" sm={10}>
                    <h5><a href={userPath}>{userName}</a></h5>
                    <p>{text}</p>
                    <p id="post-date">Post Date: {hours+":"+minutes+"    "+day+"/"+month+"/"+year}</p>
                </Col>
            </Row>

             {/* Post Actions */}
            <Row id="actions-row">
                {/* LIKE */}

                    {isUserNotLoggedIn ?   

                    <Col id="post-single-action">
                    <div 
                        className="post-icon"
                        a href=""
                        aria-label="add to favorites"
                    >
                        
                        <FaThumbsUp/> 
                        <p>{likeCount} likes</p>
                    </div> 
                    </Col>
                        :
                    <Col id="post-single-action" onClick={handleLike}
                    >
                    <div 
                        className="post-icon"
                        a href=""
                        // onClick={handleLike}
                        aria-label="add to favorites"
                    >
                        <FaThumbsUp style={isLiked? { color: "#003C78" } : null} />
                        <p>{likeCount} likes</p>
                    </div> 
                    </Col>
                    }


                {/* COMMENT */}
                <Col id="post-single-action">
                    <div 
                        className="post-icon"
                        aria-label="make comment"
                    >
                    <FaCommentAlt />
                    <p>0 comments</p>
                    </div> 
                </Col>

                {/* SHARE */}
                <Col id="post-single-action">
                    <div 
                        className="post-icon"

                        aria-label="share post"
                    >
                    <FaShareSquare />
                    <p>Share</p>
                    </div> 
                </Col>

            </Row>
            </Container>

        </div>
        
        

        // <div>
        //     POST FIELD


        //     <ul>
        //         <li>----------------  postId: {postId}  ---------------</li>
        //         <li>
        //         {isUserNotLoggedIn ?   


        //             <div 
        //                 className="icon-like"
        //                 aria-label="add to favorites"
        //             >
        //                 <FaThumbsUp/>
        //             </div> 
        //                 :
        //             <div 
        //                 className="icon-like"
        //                 onClick={handleLike}
        //                 aria-label="add to favorites"
        //             >
        //                 <FaThumbsUp style={isLiked? { color: "red" } : null} />
        //             </div> 
                        
        //             }

        //             {likeCount}
        //         </li>
        //         <li>Title: {title}</li>
        //         <li>text: {text}</li>
        //         <li>userId: {userId}</li>
        //         <li>userName: {userName}</li>
        //         <li>likeCount: {likeCount}</li>
        //     </ul>

        // </div>
    )
}

export default Post;