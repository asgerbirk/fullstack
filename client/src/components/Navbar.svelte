<script>
    import { Link} from 'svelte-navigator';
    import {accessToken} from "../store/accessToken.js";

    function handleLogout() {
        localStorage.removeItem('jwt');
        accessToken.set(null);
    }
    $: isLoggedIn = !!$accessToken;
</script>

<nav class="bg-gray-800 py-4">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
            <Link to="/" class="text-white font-bold text-lg">
                Home
            </Link>
            {#if isLoggedIn}
                <Link to="/login" on:click={handleLogout} class="text-white hover:text-gray-400 text-lg">
                    Logout
                </Link>
            {:else}
                <Link to="/login" class="text-white hover:text-gray-400 text-lg">
                    Login
                </Link>
            {/if}
        </div>
    </div>
</nav>