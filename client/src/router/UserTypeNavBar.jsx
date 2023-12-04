import React,{useState, useEffect,setState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/UserTypeNavBar.css';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const UserTypeNavBar = () => {
    // console.log(import.meta);
    let location = useLocation();
    //console.log(location.pathname === "/");

    const [user,changeUserState] = useState(null);
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
        <GoogleOAuthProvider clientId={'1041949387108-2g75rqvqqc2tt19pp2c884g7gqptgnpf.apps.googleusercontent.com'}>
            {user ? 
                (
                    <div className='navbar'>
                        <Link className={((location.pathname === "/")? "active":"" )} to="/">MenuBoard</Link>
                        <Link className={((location.pathname === "/customer")? "active":"" )} to="/customer">Customer</Link>
                        <Link className={((location.pathname === "/cashier")? "active":"" )} to="/cashier">Cashier</Link>
                        <Link className={((location.pathname === "/manager")? "active":"" )} to="/manager">Manager</Link>
                        <img className='userPicture' src={user.picture}></img>
                    </div>
                ) 
                :
                    <div className='navbar'>
                        <Link className={((location.pathname === "/")? "active":"" )} to="/">MenuBoard</Link>
                        <Link className={((location.pathname === "/customer")? "active":"" )} to="/customer">Customer</Link>
                        <GoogleLogin
                        onSuccess={loginSucess}
                        onError={loginFailure}
                        />
                    </div>
            }
        </GoogleOAuthProvider>
     );
}

export default UserTypeNavBar;