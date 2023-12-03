import React,{useState, useEffect,setState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/UserTypeNavBar.css';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


function UserTypeNavBar() {
    let location = useLocation();
    //console.log(location.pathname === "/");

    let [user,changeUser] = useState(null);
    let [loggedIn,changeLoginState] = useState(false);

    const loginSucess = async (res) => {
        let usertemp = jwtDecode(res.credential)
        console.log(usertemp);
        changeUser(user);
        changeLoginState(true);
        location.state = {};
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
                    render={(renderProps) => {
                        console.log(user);
                        if(user == null){
                            return(
                                <button 
                                    className='googleButton' 
                                    onClick={renderProps.onClick()} 
                                    disabled={renderProps.disabled}
                                >
                                    Login
                                </button>
                            );
                        }
                        else{
                            return(
                                <img src={user.picture}></img>
                            );
                        }
                    }}
                    onSuccess={loginSucess}
                    onFailure={loginFailure}
                    cookiePolicy='single_host_policy'
                />
            </GoogleOAuthProvider>
        </div>
     );
}

export default UserTypeNavBar;