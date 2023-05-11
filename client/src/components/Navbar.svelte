<script>
    import {Link, navigate} from 'svelte-navigator';
    import { removeCookie } from '../utils/cookieUtils.js';
    import {isLoggedIn, removeAccessToken} from "../store/accessToken.js";
    import {BASE_URL} from "../store/urlDomain.js";


    async function handleLogout() {
        try {
            const response = await fetch($BASE_URL + "/logout", {
                method: 'POST',
                credentials: 'include', // Include credentials for sending cookies
            });

            if (response.status === 200) {
                removeAccessToken()
                navigate("/");
            } else {
                // Handle logout error
            }
        } catch (error) {
            // Handle logout error
        }
    }
</script>


<nav class="bg-gray-800 py-4">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
            <Link to="/home" class="text-white font-bold text-lg">
                Home
            </Link>

            {#if $isLoggedIn}
                <Link to="/" on:click={handleLogout} class="text-white hover:text-gray-400 text-lg">
                    Logout
                </Link>
            {:else}
                <Link to="/" class="text-white hover:text-gray-400 text-lg">
                    Login
                </Link>
            {/if}
        </div>
    </div>
</nav>



