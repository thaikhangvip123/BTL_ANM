
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../../customize/axios";
import { useDispatch, useSelector } from "react-redux";
import { doLogin } from "../../redux/action/accountAction";
const Code = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const firstRunRef = useRef(false);
    const navigate = useNavigate();


    const dispatch = useDispatch();

    const message = useSelector(state => state.account.errMessage);
    const user = useSelector(state => state.account.userInfo);

    useEffect(()=> {
        const ssoToken = searchParams.get('ssoToken');
        if (ssoToken && firstRunRef.current === false){
            console.log('run apis >>>')
            firstRunRef.current = true;
            dispatch(doLogin(ssoToken));
        }
    }, [])


    useEffect(() => {
        if (user && user.access_token){
            navigate('/');
        }
    }, [user])

    
    return (<>
        <div className="container">
            <div className="row">
                <div className="col-12 mt-3">
                    {message}
                    {message && <span>. Please do login again. Click here to login to &nbsp;
                        <a href={`${process.env.REACT_APP_BACKEND_SSO_LOGIN}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`}>Login </a></span>} 
                </div>
            </div>
        </div>

    </>)
}

export default Code;