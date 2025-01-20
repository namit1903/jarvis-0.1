import axios from 'axios';
// import 'dotenv/config'--> this created and issue
//so as to prepend the baseURL to all requests, avoiding repetitive code
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`// If you store the token in the Authorization header and not in a cookie, you can avoid storing the token in cookies altogether
        //This means you don't have to worry about cookie-based attacks like Cross-Site Request Forgery (CSRF), since cookies are not being automatically sent with every request.
    }
})


export default axiosInstance;   