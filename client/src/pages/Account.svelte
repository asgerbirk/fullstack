<script>
    import {onMount} from "svelte";
    import {checkAuthentication} from "../auth/auth.js";
    import {BASE_URL} from "../store/urlDomain.js";
    import {isLoggedIn} from "../store/accessToken.js";
    import EditProductModal from "./EditProductModal.svelte";
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
            productUpdated = true;
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
        <h1 class="text-5xl ">Here are your products for sale</h1>

        <div class="grid grid-cols-3 gap-x-6 gap-y-8 items-start">
            {#each products as product}
                <div class="relative pt-6">
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
                    </div>
                    <div class="ml-8">
                        <div class="flex justify-between item">
                            <div>
                                <h2 class="text-lg font-bold">{product.name}</h2>
                                <p class="text-sm text-gray-600">{product.description}</p>
                                <p class="text-md font-semibold">Price: ${product.price}</p>
                            </div>
                            <div class="flex flex-col  mr-7">
                                <button class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" on:click={() => handleEditClick(product._id)}>
                                    Update
                                </button>
                                <button class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" on:click={() => deleteProduct(product._id)}>
                                    <i class="fas fa-trash-alt mr-2"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
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
        <a href="/" class="text-3xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg  px-5 py-2.5 text-center mr-2 mb-2">
            Login
        </a>
    </div>
{/if}
