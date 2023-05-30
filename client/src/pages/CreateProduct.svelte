<script>
    import { BASE_URL } from "../store/urlDomain.js";
    import { isLoggedIn } from "../store/accessToken.js";
    import { checkAuthentication } from "../auth/auth.js";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let files = []
    let name = "";
    let description = "";
    let price = "";
    let user;

    onMount(async () => {
        const authenticatedUser = await checkAuthentication();
        console.log("authenticatedUser:", authenticatedUser);
        user = authenticatedUser;
        console.log("user:", user);
    });

    async function submit() {
        try {
            const formData = new FormData();
            console.log(files)
            for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i]);
            }
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("username", user.username);
            console.log(formData);

            const response = await fetch($BASE_URL + "/products", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (response.status === 200) {
                const data = await response.json();
                user = data.user;
                isLoggedIn.set(true);
                console.log(response);
                await Swal.fire({
                    icon: "success",
                    title: "Product created!",
                    showConfirmButton: false,
                    timer: 1000,
                })
            }
        } catch (error) {
            console.error("There was an error submitting the form", error);
        }
    }



</script>



{#if $isLoggedIn}
    {#if user}
        <form on:submit|preventDefault={submit} class="w-full max-w-sm mx-auto mt-6">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="file">
                    Product Image
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                       id="file" type="file" accept="image/*" bind:files={files} multiple/>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                    Product Name
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                       id="name" type="text" bind:value={name} placeholder="Product Name" />
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                    Product Description
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                       id="description" type="text" bind:value={description} placeholder="Product Description" />
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
                    Product Price
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                       id="price" type="number" bind:value={price} placeholder="Product Price" />
            </div>
            <div class="flex items-center justify-between">
                <button class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" type="submit">
                    Submit
                </button>
            </div>
            <input type="hidden" bind:value={user.username} />
        </form>
    {/if}
{:else}
    <div class="flex flex-col items-center justify-center h-screen">
        <h2 class="text-5xl mb-4">Forbidden - either your token expired or you are not signed in - click here to sign in</h2>
        <a href="/" class="text-3xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg  px-5 py-2.5 text-center mr-2 mb-2">
            Login
        </a>
    </div>
{/if}
