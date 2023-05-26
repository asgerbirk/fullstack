import {isLoggedIn} from "../store/accessToken.js";

export async function checkAuthentication() {
    let user;
    try {
        const response = await fetch( "http://localhost:8080/users", {
            credentials: "include" // Include credentials for sending cookies
        });

        if (response.status === 200) {
            const data = await response.json();
            user = data.user;
            isLoggedIn.set(true);
        }else {
            isLoggedIn.set(false);
        }
    } catch (error) {
        console.error(error);
        isLoggedIn.set(false);
    }
    return user;
}