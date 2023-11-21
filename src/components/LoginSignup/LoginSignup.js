import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  let navigate = useNavigate();


  // const handleLogin = () => {
  //   sendRequest("login")
  //   setUsername("")
  //   setPassword("")
  //   console.log(localStorage)
  //   // history.go("/auth")
  //   window.history.go('/')
  // }

  const sendRequest = (path) => {
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
        .then((result) => {localStorage.setItem("tokenKey",result.accessToken);
                            localStorage.setItem("refreshKey",result.refreshToken);
                            localStorage.setItem("currentUser",result.userId);
                            localStorage.setItem("userName",username)})
        .catch((err) => console.log(err))
  }

  const handleSubmit = (e) => {
    sendRequest("login")
    e.preventDefault();
    console.log(username);
    console.log(password);
    console.log(localStorage.getItem("userName"))
    console.log(localStorage.getItem("tokenKey"))
    console.log(localStorage.getItem("refreshKey"))
    console.log(localStorage.getItem("currentUser"))
    // setUsername("")
    // setPassword("")
    navigate('/')
}




  return (
    <div >
      <h2>LoginSignup</h2>
            {/* <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" 
                    placeholder="username" 
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
                <button type="submit">Login</button>
            </form>
       */}

    </div>
  )
}

export default LoginSignup