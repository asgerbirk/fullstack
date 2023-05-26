<script>
    import {accessToken, isLoggedIn} from "../store/accessToken.js";
    import io from "socket.io-client";
    import {onMount} from "svelte";
    import {checkAuthentication} from "../auth/auth.js";
    import {BASE_URL} from "../store/urlDomain.js";

    let messages = [];
    let newMessage = '';
    let username = '';
    let socket;
    let showChat = false;
    let errorMessage = '';

    onMount(async () => {
        await checkAuthentication();
        if ($isLoggedIn) {
            socket = io($BASE_URL, {
                query: { token: $accessToken },
            });

            socket.on('connect', () => {
                console.log('Connected to server!');
            });

            socket.on('user-details', (data) => {
                username = data.username;
            });

            socket.on('display-message', (data) => {
                if (data) {
                    messages = [...messages, {username: data.username, message: data.message}];
                }
            });
        }
    });

    function postMessage() {
        if ($isLoggedIn) {
            if (newMessage.trim() === '') return;
            socket.emit('post-message', {username: username, message: newMessage });
            newMessage = '';
        } else {
            errorMessage = "You need to log in to post a message!";
        }
    }

    function toggleChat() {
        showChat = !showChat;
    }

</script>

<div class="fixed bottom-0 right-0 p-4">
    <button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out" on:click={toggleChat}>
        {showChat ? 'Hide Chat' : 'Show Chat'}
    </button>
    {#if showChat}
        <div class="bg-white p-4 mt-4 rounded shadow-lg w-64">
            <form on:submit|preventDefault={postMessage}>
                <input class="border p-2 rounded w-full" type="text" bind:value={newMessage} placeholder="Write your message here..." required>
                <button class="bg-green-500 text-white px-4 py-2 mt-2 rounded" type="submit">Post Message</button>
            </form>
            {#if errorMessage}
                <p class="text-red-500">{errorMessage}</p>
            {/if}
            <div>
                {#each messages as message (message)}
                    <p><strong>{message.username}</strong>: {message.message}</p>
                {/each}
            </div>
        </div>
    {/if}
</div>
