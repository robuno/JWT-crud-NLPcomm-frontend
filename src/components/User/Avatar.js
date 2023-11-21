
import React, { useState } from "react";
import { PutWithAuth } from '../../services/HttpService';

function Avatar(props) { 
    const {avatarId, userId, userName, userEmail, registerDate} = props;

    return (
        <div>
            <h4>{userName}</h4>
            <p>{userEmail}</p>
            <p>{registerDate}</p>


        </div>
    )

}
export default Avatar;