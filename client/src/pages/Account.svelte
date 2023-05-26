<script>
    import {onMount} from "svelte";
    import {checkAuthentication} from "../auth/auth.js";
    import {BASE_URL} from "../store/urlDomain.js";
    import {isLoggedIn} from "../store/accessToken.js";
    import EditProductModal from "./EditProductModal.svelte";
    import ChatBot from "../components/ChatBot.svelte";
    import Carousel from "svelte-carousel";

    let products = [];
    let user;

    let editingProduct = null;
    let showModal = false;
    let productUpdated = false;



    onMount(async () => {
        user = await checkAuthentication();

        if (user) {
            const response = await fetch($BASE_URL + `/products/${user.username}`, {
                method: "GET",
                credentials: "include"
            });

            if (response.status === 200) {
                products = await response.json();
            } else {
                console.error("Failed to load products");
            }
        }
    });

    async function deleteProduct(productId) {
        const response = await fetch($BASE_URL + `/products/${productId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (response.status === 200) {
            products = products.filter(product => product._id !== productId);
        } else {
            console.error("Failed to delete product");
        }
    }


    function handleEditClick(productId) {
        editingProduct = products.find(product => product._id === productId);
        showModal = true;
    }



    function handleProductUpdate(event) {
        const updatedProduct = event.detail;
        const index = products.findIndex(product => product._id === updatedProduct._id);

        if (index !== -1) {
            products[index] = updatedProduct;
            productUpdated = true; // Set the flag to trigger re-render
        }
    }

    function handleModalToggle() {
        if (!showModal) {
            productUpdated = false;
        }
    }

</script>


{#if $isLoggedIn}
    {#if user}
<h1 class="text-5xl  mb-16 ">Here is your products for sale </h1>

<div class="grid grid-cols-3 gap-x-6 gap-y-8">
    {#each products as product}
        <div class="relative pt-6">
            <div class="text-black font-bold p-1 mb-2">
                    <button class="bg-blue-500 text-white font-bold p-1 mb-2 rounded absolute top-0 left-0" on:click={() => handleEditClick(product._id)}>
                        Edit
                    </button>
                <button class="bg-red-600 text-white font-bold p-1 mb-2 rounded absolute top-0 right-0" on:click={() => deleteProduct(product._id)}>
                    Delete
                </button>
            </div>
            <div class="flex justify-center">
                <Carousel>
                    {#each product.imageUrls as imageUrls}
                        <img
                                class="w-full h-64 object-cover rounded shadow transform transition duration-500 hover:scale-105 hover:shadow-lg"
                                src={imageUrls}
                                alt={product.name}
                        />
                    {/each}
                </Carousel>
            </div>            <div class="mt-2">
                <h2 class="text-lg font-bold">{product.name}</h2>
                <p class="text-sm text-gray-600">{product.description}</p>
                <p class="text-md font-semibold">Price: ${product.price}</p>
            </div>
        </div>
    {/each}
</div>
        {#if editingProduct}
            <EditProductModal
                    bind:product={editingProduct}
                    bind:showModal={showModal}
                    on:update={handleProductUpdate}
                    on:close={handleModalToggle}/>
        {/if}
{/if}
{:else}
    <div class="flex flex-col items-center justify-center h-screen">
        <h2 class="text-5xl mb-4">Forbidden - either your token expired or you are not signed in - click here to sign in</h2>
        <a href="/" class="text-3xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">
            Login
        </a>
    </div>

{/if}
