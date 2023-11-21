import React, {useState, useEffect} from "react";
import { Button, Form } from "react-bootstrap";
// import LoginSignup from "../LoginSignup/LoginSignup";
import { useNavigate } from "react-router-dom";


function WelcomePage()  {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    let navigate = useNavigate();

    const handleUsername = (value) => {
      setUsername(value)
    } 

    const handlePassword = (value) => {
        setPassword(value)
    }

    const sendRequestLogin = (path) => {
      fetch("/api/v1/auth/"+path,
      {
          method:"POST",
          headers: {
              "Content-Type":"application/json",
          },
          body: JSON.stringify({
              userName: username,
              password: password,
          }),
      })
      .then((res) => res.json())
      .then((result) => {
        console.log("response accessToken:",result.accessToken);
        console.log("response refreshToken:",result.refreshToken);
        // console.log("response userId:",result.userId);
        console.log("response message:",result.message);
        console.log("response message:",result.message);
        
        if(result.message === "Login is successful!")
        { 
          localStorage.setItem("tokenKey",result.accessToken);
          localStorage.setItem("refreshKey",result.refreshToken);
          localStorage.setItem("currentUser",result.userId);
          localStorage.setItem("userName",username) 
          // navigate('/');
        } 
        else 
        { 
          alert("Incorrect Email and Password not match");
          setPassword("")  
        }
     }
     ).catch((err) => console.log(err))
    }

    const sendRequestRegister = (path) => {
      fetch("/api/v1/auth/"+path,
      {
          method:"POST",
          headers: {
              "Content-Type":"application/json",
          },
          body: JSON.stringify({
              userEmail:email,
              userName: username,
              password: password,
          }),
      })
      .then((res) => res.json())
      .then((result) => {
        console.log("response accessToken:",result.accessToken);
        console.log("response refreshToken:",result.refreshToken);
        // console.log("response userId:",result.userId);
        console.log("response message:",result.message);
        
        if(result.message === "User is successfully registered!!!")
        { 
          localStorage.setItem("tokenKey",result.accessToken);
          localStorage.setItem("refreshKey",result.refreshToken);
          localStorage.setItem("currentUser",result.userId);
          localStorage.setItem("userName",username) 
          navigate('/');
        } 
        else 
        { 
          alert("Incorrect Email and Password not match");
          setPassword("")  
        }
     }
     ).catch((err) => console.log(err))
    }

  const handleSubmitLogin = () => {
      // if (username === "" || password === "") {
      //   console.log("fields must be filed!");
      //   alert("fields field must be filed!");
      //   // e.preventDefault();
      // }
      // else if (password !== "" && password !== "") {
      //   console.log(localStorage)
      //   console.log("submitted username:",username)
      //   console.log("submitted password:",password)
      //   sendRequestLogin("login")
      //   navigate("/")
      //   // e.preventDefault();
      // }

      console.log(localStorage)
      console.log("submitted username:",username)
      console.log("submitted password:",password)
      sendRequestLogin("login")
      navigate("/")
  }

  const handleSubmitRegister = (e) => {
    if (username === "" || password === "") {
      console.log("fields must be filed!");
      alert("fields field must be filed!");
      e.preventDefault();
    }
    else if (password !== "" && password !== "" && email !== "") {
      console.log("submitted email:",email);
      console.log("submitted username:",username);
      console.log("submitted password:",password);
      sendRequestRegister("register");
      e.preventDefault();
    }  
  }





  return (
    


      <Form>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>username</Form.Label>
              <Form.Control 
                onChange = {(i) => handleUsername(i.target.value)} 
                type="text" 
                placeholder="Enter username" 
              />
              {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text> */}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                onChange = {(i) => handlePassword(i.target.value)}
                type="password" 
                placeholder="Password" 
              />
            </Form.Group> 

            <Button 
              variant="primary" 
              // type="submit"
              onClick={()=>handleSubmitLogin()}
            >
              Login
            </Button>
        </Form>

          








    
  )
}
export default WelcomePage;