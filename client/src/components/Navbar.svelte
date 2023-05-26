<script>
    import {Link, navigate} from 'svelte-navigator';
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
            <div class="flex items-center">
                <Link to="/home" class="text-white font-bold text-2xl hover:text-gray-400">
                    Zando Commerce
                </Link>
            </div>
            <div class="flex items-center space-x-4">

                <Link to="/createProduct" class="text-white  text-lg hover:text-gray-400">
                    Create product
                </Link>
                <Link to="/products" class="text-white  text-lg hover:text-gray-400">
                    Products
                </Link>
                <Link to="/account" class="text-white  text-lg hover:text-gray-400">
                    Account
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
    </div>
</nav>



