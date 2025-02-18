import React, { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import Protected from "../componants/Protected";
import Public from "../componants/Public";



const useAuth = () => {

  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    const client = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
    });
    client
      .init({
        onLoad: "login-required",
      })
      .then((res) => {
        setLogin(res);
      });
  }, []);

  return [isLogin];
};
const LoginForm = () => {
  const [isLogin] = useAuth();
  return isLogin ? <Protected  /> : <Public />;
}

export default LoginForm;