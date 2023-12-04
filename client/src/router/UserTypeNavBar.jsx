import React,{useState, useEffect,setState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/UserTypeNavBar.css';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const UserTypeNavBar = () => {
    let location = useLocation();
    //console.log(location.pathname === "/");

    const [user,changeUserState] = useState(undefined);
    const [loggedIn,changeLoginState] = useState(false);

    const loginSucess = async (res) => {
        //useEffect(() => {
            let usertemp = jwtDecode(res.credential)
            //console.log(usertemp);
            console.log(user);
            changeUserState(usertemp);
            changeLoginState(true);
            console.log(user);
        //},[])
        
    }
    
    const loginFailure = (error) => {
        console.log(error);
        console.log('Google Sign in was unsucessful');
    }

    return (
        <div className="navbar">
            <Link className={((location.pathname === "/")? "active":"" )} to="/">MenuBoard</Link>
            <Link className={((location.pathname === "/customer")? "active":"" )} to="/customer">Customer</Link>
            <Link className={((location.pathname === "/cashier")? "active":"" )} to="/cashier">Cashier</Link>
            <Link className={((location.pathname === "/manager")? "active":"" )} to="/manager">Manager</Link>
            <GoogleOAuthProvider clientId='1041949387108-2g75rqvqqc2tt19pp2c884g7gqptgnpf.apps.googleusercontent.com'>
                <GoogleLogin
                    onSuccess={loginSucess}
                    onError={loginFailure}
                />
            </GoogleOAuthProvider>
        </div>
     );
}

export default UserTypeNavBar;