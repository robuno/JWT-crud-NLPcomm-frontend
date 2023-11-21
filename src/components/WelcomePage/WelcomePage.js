import React, {useState, useCallback} from "react";
// import LoginSignup from "../LoginSignup/LoginSignup";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.scss";
import Swal from "sweetalert2";
import axios from "axios";

function WelcomePage()  {
    const [displayLoginForm, setDisplayLoginForm] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    let navigate = useNavigate();

    const toggleForm = () => {
      setDisplayLoginForm(!displayLoginForm)
    }

    const handleUsername = (value) => {
      setUsername(value)
    } 

    const handlePassword = (value) => {
        setPassword(value)
    }


    const sendLoginRequestAxios =  useCallback(async(path) => {
      try {
          const result = await axios.post(`/api/v1/auth/`+path,
          {
            userName: username,
            password: password,
          }
          );


          console.log("res:",result)
          console.log("status:",result.status)
          console.log("response accessToken:",result.data.accessToken);
          console.log("response refreshToken:",result.data.refreshToken);
          // console.log("response userId:",result.data.userId);
          console.log("response message:",result.data.message);   
          
          if(result.data.message === "LoginUser_OK")
          { 
            localStorage.setItem("tokenKey",result.data.accessToken);
            localStorage.setItem("refreshKey",result.data.refreshToken);
            localStorage.setItem("currentUser",result.data.userId);
            localStorage.setItem("userName",username) 
            navigate('/');
          } 
          else if(result.data.message === "LoginUser_INV")
          { 
            Swal.fire({
              title: "Email and Password not match!",
              icon: "error"
            });
            setPassword("")  
            setUsername("")
          } else {
            Swal.fire({
              title: "Email and Password not match!",
              icon: "error"
            });
            setPassword("")  
            setUsername("")
          }
      }
      catch(err) {

        if(err.response.status === 400) {
          console.log("err status:",err.response.status)
          Swal.fire({
            title: "Email and Password not match!",
            icon: "error"
          });
          setPassword("")  
          setUsername("")

      }
      }
  })



  // const sendRequestLogin = (path) => {
  //     fetch("/api/v1/auth/"+path,
  //     {
  //         method:"POST",
  //         headers: {
  //             "Content-Type":"application/json"
  //         },
  //         body: JSON.stringify({
  //             userName: username,
  //             password: password,
  //         }),
  //     })
  //     .then((res) => res.json())
  //     .then((result) => {
  //       console.log("response accessToken:",result.accessToken);
  //       console.log("response refreshToken:",result.refreshToken);
  //       // console.log("response userId:",result.userId);
  //       console.log("response message:",result.message);
  //       // console.log("response :",result);
        
  //       if(result.message === "LoginUser_OK")
  //       { 
  //         localStorage.setItem("tokenKey",result.accessToken);
  //         localStorage.setItem("refreshKey",result.refreshToken);
  //         localStorage.setItem("currentUser",result.userId);
  //         localStorage.setItem("userName",username) 
  //         navigate('/');
  //       } 
  //       else if(result.message === "LoginUser_INV")
  //       { 
  //         Swal.fire({
  //           title: "Email and Password not match!",
  //           icon: "error"
  //         });
  //         setPassword("")  
  //         setUsername("")
  //       } 
  //       else 
  //       { 
  //         Swal.fire({
  //           title: "Email and Password not match!",
  //           icon: "error"
  //         });
  //         setPassword("")  
  //       }
  //    }
  //    ).catch((err) => console.log(err))
  //   }

  //   const sendRequestRegister = (path) => {
  //     fetch("/api/v1/auth/"+path,
  //     {
  //         method:"POST",
  //         headers: {
  //             "Content-Type":"application/json",
  //         },
  //         body: JSON.stringify({
  //             userEmail:email,
  //             userName: username,
  //             password: password,
  //         }),
  //     })
  //     .then((res) => res.json())
  //     .then((result) => {
  //       console.log("response accessToken:",result.accessToken);
  //       console.log("response refreshToken:",result.refreshToken);
  //       // console.log("response userId:",result.userId);
  //       console.log("response message:",result.message);
  //       console.log("response status:",result.status);
        
  //       if(result.message === "RegisterUser_OK")
  //       { 
  //         localStorage.setItem("tokenKey",result.accessToken);
  //         localStorage.setItem("refreshKey",result.refreshToken);
  //         localStorage.setItem("currentUser",result.userId);
  //         localStorage.setItem("userName",username) 
  //         navigate('/');
  //       } 
  //       else 
  //       { 
  //         Swal.fire({
  //           title: "There is a registered user with given username! Please try again!",
  //           icon: "error"
  //         });
  //         setUsername("")
  //         setPassword("")  
  //       }
  //    }
  //    ).catch((err) => console.log(err))
  // }


  const sendRegisterRequestAxios =  useCallback(async(path) => {
    try {
        const result = await axios.post(`/api/v1/auth/`+path,
        {
          userEmail:email,
          userName: username,
          password: password,
        }
        );


        console.log("res:",result)
        console.log("response accessToken:",result.data.accessToken);
        console.log("response refreshToken:",result.data.refreshToken);
        // console.log("response userId:",result.userId);
        console.log("response message:",result.data.message);
        console.log("response status:",result.status); 
        
        // if(result.data.message === "RegisterUser_OK")
        if(result.status === 201)
        { 
          localStorage.setItem("tokenKey",result.data.accessToken);
          localStorage.setItem("refreshKey",result.data.refreshToken);
          localStorage.setItem("currentUser",result.data.userId);
          localStorage.setItem("userName",username) 
          navigate('/');
        } 
        else 
        { 
          Swal.fire({
            title: "There is a registered user with given username! Please try again!",
            icon: "error"
          });
          setUsername("")
          setPassword("")  
        }
    }
    catch(err) {

      if(err.response.status === 400) {
        console.log("err status:",err.response.status)
        Swal.fire({
          title: "There is a registered user with given username! Please try again!!",
          icon: "error"
      });
      setPassword("")  
      setUsername("")

    }
    }
})

  const handleSubmitLogin = (e) => {
      if (username === "" || password === "") {
        console.log("fields must be filed!");
        Swal.fire({
          title: "Email and Password fields must be filled!",
          icon: "warning"
        });
        e.preventDefault();
      }
      else if (password !== "" && password !== "") {
        console.log("submitted username:",username)
        console.log("submitted password:",password)
        sendLoginRequestAxios("login");
        e.preventDefault();
      }
  }

  const handleSubmitRegister = (e) => {
    if (username === "" || password === "") {
      console.log("fields must be filed!");
      Swal.fire({
        title: "Email and Password fields must be filled!",
        icon: "warning"
      });
      e.preventDefault();
    }
    else if (password !== "" && password !== "" && email !== "") {
      console.log("submitted email:",email);
      console.log("submitted username:",username);
      console.log("submitted password:",password);
      sendRegisterRequestAxios("register");
      e.preventDefault();
    }  
  }



  if(displayLoginForm) {
    return(
    <div class="login-register-forms-main">
      <div className='auth-form-container'>
            <form className="login-form" onSubmit={handleSubmitLogin}>
            <h2>Login</h2>
                <label htmlFor="username">Username</label>
                <input 
                    value={username}
                    onChange={(e) => handleUsername(e.target.value)}
                    type="text" 
                    placeholder="" 
                    id="username" 
                    name="username" 
                />
                <label htmlFor="password">password</label>
                <input 
                    value={password}
                    onChange={(e) => handlePassword(e.target.value)} 
                    type="password" 
                    placeholder="********" 
                    id="password" 
                    name="password" 
                />
                <button onClick={(e)=>handleSubmitLogin(e)}>Login</button>
                
            </form>
            <button class="form-toggler" onClick={toggleForm}>You do not have account? Register for free!</button>
        
      </div>  
    </div>)
  } 
  else if(!displayLoginForm) {
    return(
    
    <div class="login-register-forms-main">
      <div className='auth-form-container'>
        
            <form className="register-form" onSubmit={handleSubmitRegister}>
              <h2>Register</h2>
              <label htmlFor="email">E-Mail</label>
                  <input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email" 
                      placeholder="" 
                      id="email" 
                      name="email" 
                />
                <label htmlFor="username">Username</label>
                <input 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" 
                    placeholder="" 
                    id="username" 
                    name="username" 
                />
                <label htmlFor="password">password</label>
                <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    type="password" 
                    placeholder="********" 
                    id="password" 
                    name="password" 
                />
                <button type="submit">Register</button>
            </form>
            <button class="form-toggler" onClick={toggleForm}>Already have an account? Login here.</button>
        </div>
    </div>
    )
  }

}
export default WelcomePage;