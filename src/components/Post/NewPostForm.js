import React, {useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { RefreshToken } from "../../services/HttpService";
import './NewPostForm.scss';
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

function NewPostForm(props) { 
    const {userId, userName, refreshPosts} = props;
    const [postTitle, setPostTitle] = useState("")
    const [posttext, setPosttext] = useState("")
    const [isSent, setIsSent] = useState(false);
    let navigate = useNavigate();

    const handlePosttext = (value) => {
        setPosttext(value)
    } 

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        navigate("/");
    }



    const sendPostAxios =  useCallback(async() => {
        try {
            const result = await axios.post(`/api/v1/posts`,
                {
                    title: postTitle, 
                    userId : userId,
                    text : posttext,
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
                        sendPostAxios();
                        // setCommentRefresh();
                    }})
                .catch((err) => {
                    console.log("err:",err)
                })
            }
        }
    })

    // const saveNewPost = () => {
    //     PostWithAuth("/api/v1/posts", {
    //       title: postTitle, 
    //       userId : userId,
    //       text : posttext,
    //     })
    //     .then((res) => {
    //         if(!res.ok) {
    //             RefreshToken()
    //             .then((res) => { if(!res.ok) {
    //                 logout();
    //             } else {
    //                return res.json()
    //             }})
                
    //             .then((result) => {
    //                 console.log(result)

    //                 if(result != undefined){
    //                     localStorage.setItem("tokenKey",result.accessToken);
    //                     saveNewPost();
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


    const handleSubmitPost = (e) => {
        if (posttext === "" ) {
            console.log("Post field must be filled!");
            Swal.fire({
                title: "Post field must be filled!",
                icon: "info"
              });
            // alert("Post field must be filed!");
            e.preventDefault();
        }
        else if (posttext !== "" ) {
            console.log("submitted text:",posttext)
            sendPostAxios()
            setIsSent(true);
            setPosttext("");
            refreshPosts(); 
            e.preventDefault();
            
        }

    }

    return(
        <div>
            <div className='newpost-form-container'>
                <Container>
                    <Row id="new-post-row">
                        <Col id="post-left-side" sm={2}>
                            <img src="/avatars/avatar_0.png" alt="Italian Trulli"></img>
                        </Col>
                        <Col id="post-medium-side" sm={10}>
                        <form className="newpost-form" onSubmit={handleSubmitPost}>
                            {/* <label htmlFor="posttext">Post Text</label> */}
                            <textarea  
                                value={posttext}
                                onChange={(e) => handlePosttext(e.target.value)}
                                type="text" 
                                id="posttext" 
                                name="posttext" 
                            />
                            <button onClick={(e)=>handleSubmitPost(e)}>Share</button>
                        </form>
                        </Col>
                    </Row>
                </Container>


            </div>


        </div>
    )
}
export default NewPostForm;