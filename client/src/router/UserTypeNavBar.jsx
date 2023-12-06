import React,{useState, useEffect,setState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/UserTypeNavBar.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

/**
 * UserTypeNavBar component for displaying navigation based on user type.
 *
 * @component
 * @returns {JSX.Element} The UserTypeNavBar component.
 */
const UserTypeNavBar = () => {
    // console.log(import.meta);
    let location = useLocation();
    //console.log(location.pathname === "/");

    const [user,changeUserState] = useState(null);
    const [loggedIn,changeLoginState] = useState(false);
    const [roles, changeRoleState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('customer')

     /**
     * Fetches user roles from the server.
     *
     * @function
     * @async
     * @returns {void}
     */
    useEffect(() => {
        fetch('http://localhost:3000/login_info')
          .then(response => response.json())
          .then(data => changeRoleState(data.login_info))
          .then(() => setLoading(false))
          .catch(error => console.error('Error:', error));
      }, []);

    /**
     * Handles successful login by decoding user information from JWT.
     *
     * @function
     * @param {Object} res - The response object containing the user credential.
     * @returns {void}
     */
    const loginSucess = async (res) => {
        //useEffect(() => {
            let usertemp = jwtDecode(res.credential)
            let userEmail = roles.find((i) => i.email == usertemp.email);
            if(userEmail == undefined){
                setRole('customer');
                console.debug('setting user to customer');
            }
            else{
                setRole(userEmail.role);
                console.debug('setting user to: ' + userEmail.role);
            }
            changeUserState(usertemp);
            changeLoginState(true);
            
        //},[])
        
    }
    
     /**
     * Handles login failure.
     *
     * @function
     * @param {Object} error - The error object.
     * @returns {void}
     */
    const loginFailure = (error) => {
        console.log(error);
        console.log('Google Sign in was unsucessful');
    }

    /**
     * Logs out the user.
     *
     * @function
     * @returns {void}
     */
    const logout = () => {
        changeUserState(null);
        changeLoginState(false);
        setRole('customer');
    }

    if(loading){
        return (
            <p>Loading...</p>
        )
    }

    console.log(user);
    if(loggedIn && role == 'manager'){ 
        return (
            <div className='navbar'>
                <Link className={((location.pathname === "/")? "active":"" )} to="/">MenuBoard</Link>
                <Link className={((location.pathname === "/customer")? "active":"" )} to="/customer">Customer</Link>
                <Link className={((location.pathname === "/cashier")? "active":"" )} to="/cashier">Cashier</Link>
                <Link className={((location.pathname === "/manager")? "active":"" )} to="/manager">Manager</Link>
                <img className='userPicture' src={user.picture}></img>
                <button onClick={logout}>Logout</button>
            </div>
        );
    }
    else if(loggedIn && role == 'cashier'){ 
        return (
            <div className='navbar'>
                <Link className={((location.pathname === "/")? "active":"" )} to="/">MenuBoard</Link>
                <Link className={((location.pathname === "/customer")? "active":"" )} to="/customer">Customer</Link>
                <Link className={((location.pathname === "/cashier")? "active":"" )} to="/cashier">Cashier</Link>
                <img className='userPicture' src={user.picture}></img>
                <button onClick={logout}>Logout</button>
            </div>
        );
    }
    else if (loggedIn){
        return(
            <div className='navbar'>
                <Link className={((location.pathname === "/")? "active":"" )} to="/">MenuBoard</Link>
                <Link className={((location.pathname === "/customer")? "active":"" )} to="/customer">Customer</Link>
                <img className='userPicture' src={user.picture}></img>
                <button onClick={logout}>Logout</button>
            </div>
        )
    }
    else{
        return (
            <div className='navbar'>
                <Link className={((location.pathname === "/")? "active":"" )} to="/">MenuBoard</Link>
                <Link className={((location.pathname === "/customer")? "active":"" )} to="/customer">Customer</Link>
                <GoogleLogin
                onSuccess={loginSucess}
                onError={loginFailure}
                />
            </div>
        );
    }
}

export default UserTypeNavBar;