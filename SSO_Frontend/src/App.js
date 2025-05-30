
import { useEffect } from 'react';
import About from './components/About/About';
import Header from './components/Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccount } from './redux/action/accountAction';
import RingLoader from "react-spinners/RingLoader";
import {css} from "@emotion/react";



const App = () => {
  const override = css`
    display: block;
    margin: 0 auto;
    borderColor: "red";
  `;
  const dispatch = useDispatch();
  const user = useSelector(state => state.account.userInfo);
  const isLoading = useSelector(state => state.account.isLoading);

  
  useEffect(()=> {
    if (user && !user.access_token){
      dispatch(doGetAccount());
    }
  }, [])


  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  return (
    <>
      {isLoading === true ? 
        <div style={style}>
          <RingLoader
            color={"#36d7b7"}
            loading={true}
            css={override}
            size={150}
          />
        </div>
        :
        <div className="App">
          <Header> </Header>
          
        </div>
      }
    </>
  );
}

export default App;
