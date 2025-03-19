import Cookies from 'js-cookie'
import cookie from 'cookie'

export default function AuthToken() {
    const key = "auth_token"

    function saveToken(token: string) {
        Cookies.set(key, token)
        localStorage.setItem(key, token)
    }

    // pass req object for server side
    function retrieveToken(req?: any) {
        if (req) {
            if (!req.headers.cookie) {
                return null
            }
            return cookie.parse(req.headers.cookie).auth_token
        }
        return Cookies.get(key)
    }

    function clearToken() {
        localStorage.removeItem(key)
        Cookies.remove(key)
    }

    return { saveToken, retrieveToken, clearToken }
}