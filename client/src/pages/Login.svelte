<script>
    import {navigate} from "svelte-navigator";
    import {BASE_URL} from "../store/urlDomain.js";
    import Swal from "sweetalert2";
    import {accessToken} from "../store/accessToken.js";
    import {setCookie} from "../utils/cookieUtils.js";

    let username = "";
    let password = "";
    async function handleLogin() {
        try{
            const response =  await fetch($BASE_URL + "/login", {
                credentials: 'include',
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (response.status === 200){
                const data = await response.json();
                setCookie('jwt', data.accessToken, { expires: 1 });
                accessToken.set(data.accessToken);

                Swal.fire({
                    icon: "success",
                    title: "Login successful!",
                    showConfirmButton: false,
                    timer: 3000,
                }).then(() => {
                    navigate("/home");
                });


            }else {
                const errorData = await response.json();
                console.log(errorData.message);
                await Swal.fire({
                    icon: "error",
                    showConfirmButton: false,
                    title: "Oops...",
                    text: errorData.message,
                    timer: 2000,
                    timerProgressBar: true,
                    position: "top"
                });
            }

        }catch (error){
            console.log(error)
        }
    }

</script>

<div class="flex justify-center items-center h-screen">
    <form class="w-full max-w-xl p-8 bg-white rounded-lg shadow-md border-2 border-gray-400">
        <h1 class="text-xl font-bold mb-4">Login</h1>

        <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="username">
                Username
            </label>
            <input
                    class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    bind:value={username}
            />
        </div>

        <div class="mb-6">
            <label class="block text-gray-700 font-bold mb-2" for="password">
                Password
            </label>
            <input
                    class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    bind:value={password}
            />
        </div>

        <div class="flex items-center justify-between">
            <button
                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    type="button"
                    on:click={handleLogin}
            >
                Sign In
            </button>
            <a class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" href="/register">
                Register
            </a>
        </div>
    </form>
</div>