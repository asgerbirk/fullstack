<script>



import ChatBot from "../components/ChatBot.svelte";
import {onMount} from "svelte";
import {checkAuthentication} from "../auth/auth.js";
import {BASE_URL} from "../store/urlDomain.js";
import {cartCount} from "../store/cartStore.js";

let user;
onMount(async () => {
    try {
        user = await checkAuthentication();
        if (user) {
            const response = await fetch($BASE_URL + `/carts/${user._id}`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json' // Add this line to set the request headers
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Update cartCount store based on the number of items in the user's cart
                cartCount.set(data.items.length);
            }
        }
    } catch (error) {
        console.error('Failed to fetch cart:', error);
    }
});
</script>
<div class="pt-10 bg-gray-100">
    <h1 class="text-6xl font-bold text-center text-blue-800">Home</h1>
</div>
<ChatBot/>








