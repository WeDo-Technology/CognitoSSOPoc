import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {CognitoUserPool} from "amazon-cognito-identity-js";
import {useEffect, useState} from "react";

function App() {
    const [user, setUser] = useState(new CognitoUserPool(window.identityRelay.settings.cognitoConfig).getCurrentUser());

    useEffect(() => {
       const timeout = setInterval(async () => {
           const userPool = new CognitoUserPool(window.identityRelay.settings.cognitoConfig);
           setUser(userPool.getCurrentUser());
       }, 1000);
         return () => clearInterval(timeout);
    }, [user]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
        {user ? (
            <div>
                <h2>Logged in <code>{user.getUsername()}</code></h2>
            </div>
        ) : (
            <div>
                <h2>Not logged in</h2>
            </div>
        )}
    </>
  )
}

export default App
