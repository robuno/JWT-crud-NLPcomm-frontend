import React, {useState, useEffect, useCallback} from "react";
import LoginSignup from "../LoginSignup/LoginSignup";
import { Button, Col, Container, Row } from "react-bootstrap";
import { RefreshToken } from "../../services/HttpService";
import Post from "../Post/Post";
import NewPostForm from "../Post/NewPostForm";
import './Home.scss';

import { FaRegNewspaper, FaBullhorn } from 'react-icons/fa';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home()  {
  const [error, setError] = useState(null);
  const [isLoadedPosts, setIsLoadedPosts] = useState(false);
  const [postList, setPostList] = useState([]);
  let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        navigate("/");
    }


  const getPosts =  useCallback(async() => {
    try {
        const result = await axios.get(`/api/v1/posts`);
        console.log("status:",result.status)
        setIsLoadedPosts(true);
        console.log("posts:",result.data)
        setPostList(result.data)
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
                    getPosts();
                    // setCommentRefresh();
                }})
            .catch((err) => {
                console.log("err:",err)
                setError(err)
            })
        }
    }
})

  // const refreshPosts = () => {
  //   fetch("/api/v1/posts")
  //   .then(res => res.json())
  //   .then(
  //       (result) => {
  //           setIsLoadedPosts(true);
  //           console.log(result)
  //           setPostList(result)
  //       },
  //       (error) => {
  //           console.log(error)
  //           setIsLoadedPosts(true);
  //           setError(error);
  //       }
  //   )
  // }

  useEffect(() => {
    getPosts()
  }, [postList])


  if(error) {return <div>There is an error while uploading posts!!!</div>; }
  else if(!isLoadedPosts) { return <div>Loading posts...</div>; } 
  
  else if(isLoadedPosts) {
    return (
      <div class="home-page">

        <Container>
          <Row>
          <Col id="home-middle-menu" sm={9}>
                  {/* <p>UserID: {localStorage.getItem("currentUser")}</p>
                  <p>Username: {localStorage.getItem("userName")}</p> */}

                  {localStorage.getItem("currentUser") == null ? "":
                        <NewPostForm 
                            userId = {localStorage.getItem("currentUser")} 
                            userName = {localStorage.getItem("userName")}  
                            refreshPosts = {getPosts}
                        />
                        }


                  {postList.map( post => (
                            <Post  
                                
                                
                                postId= {post.id}
                                userId= {post.userId} 
                                userName= {post.userName} 
                                title={post.title} 
                                text={post.text}
                                createDate={post.createDate}
                                likes = {post.postLikes}
                                
                                >
                            </Post>
                            
                        ))}


            
          </Col>


          <Col id="home-right-menu" sm={3}>
            {localStorage.getItem("currentUser") == null ? ""
            :
            <div class="right-section">
              <h5>Notifications</h5>
              <p>You do not have a recent notification!</p>
            </div>}

            <div class="right-section">
              <h5>Announcements</h5>
              <ul>
                <li><FaBullhorn /><a href="#">Announcement 1!</a></li>
                <li><FaBullhorn /><a href="#">Announcement 2!</a></li>
                <li><FaBullhorn /><a href="#">Announcement 3!</a></li>
              </ul>

            </div>

            <div class="right-section">
              <h5>News</h5>
              <ul>
                <li><FaRegNewspaper /><a href="#">News 1!</a></li>
                <li><FaRegNewspaper /><a href="#">News 2!</a></li>
                <li><FaRegNewspaper /><a href="#">News 3!</a></li>
                <li><FaRegNewspaper /><a href="#">News 4!</a></li>
                <li><FaRegNewspaper /><a href="#">News 5!</a></li>
                <li><FaRegNewspaper /><a href="#">News 6!</a></li>
              </ul>

            </div>
          </Col>
          </Row>
        </Container>

        




                
                

  



          
  
      </div>
      
    )
  } 

  
}
export default Home;