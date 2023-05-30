<script>
    import {BASE_URL} from "../store/urlDomain.js";
    import Swal from "sweetalert2";

        let username = "";
        let email = "";
        let password = "";
    async function handleRegister() {
        try{
            const response =  await fetch($BASE_URL + "/register", {
                credentials: 'include',
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            if (response.status === 200){
                const data = await response.json();
                console.log(data)
                if (data.message === "User created and verification email sent") {
                    await Swal.fire({
                        icon: "info",
                        title: "Almost there!",
                        timer: 2000,
                        text: "Please check your email to verify your account",
                        showConfirmButton: true,
                    });
                }
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
    <form class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 class="text-xl font-bold mb-4">Register</h1>

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

        <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="email">
                Email
            </label>
            <input
                    class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    bind:value={email}
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
                    on:click={handleRegister }
            >
                Register
            </button>
        </div>
    </form>
</div>