import React from "react";
const Public = () => {
  window.location.href = "http://localhost:9090/realms/myRealm/protocol/openid-connect/auth?client_id=medical-registry&response_type=code&redirect_uri=http://localhost:1420/home";
  return (<div></div>);
};

export default Public;