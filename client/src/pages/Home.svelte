<script>
    import {onMount} from "svelte";
    import {BASE_URL} from "../store/urlDomain.js";
    import {isLoggedIn} from "../store/accessToken.js";

    let user;

    $: {
        if (!$isLoggedIn) {
            user = null;
        }
    }

    onMount(async () => {
        try {
            const response = await fetch($BASE_URL + "/user", {
                credentials: "include" // Include credentials for sending cookies
            });


            if (response.status === 200) {
                const data = await response.json();
                user = data.user;
            } else {

                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

<div>
    {#if user}
        <h2 class="text-center text-4xl">Welcome {user.username}</h2>
    {/if}
</div>






