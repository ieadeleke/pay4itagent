import AuthToken from "../AuthToken";

export function logOut(){
    AuthToken().clearToken()
}