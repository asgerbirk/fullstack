<script>
    import Carousel from "svelte-carousel";

    export let item;

    function removeFromCart() {
        // Implement your logic to remove the item from the cart.
    }
</script>

{#if item.product}
    <div class="flex pt-6 bg-gray-100 rounded p-4">
        <!-- Product Image and Details -->
        <div class="w-full">
            <div class="flex bg-white rounded p-4">
                <!-- Product Image -->
                <div class="w-1/2">
                    <div class="flex justify-center">
                        <Carousel>
                            {#each item.product.imageUrls as imageUrl}
                                <img
                                        class="w-full object-cover rounded shadow transform transition duration-500 hover:scale-105 hover:shadow-lg"
                                        src={imageUrl}
                                        alt={item.product.name}
                                />
                            {/each}
                        </Carousel>
                    </div>
                </div>
                <!-- Product Details -->
                <div class="w-1/2 ml-4">
                    <h2 class="text-lg font-bold">{item.product.name}</h2>
                    <p class="text-sm text-gray-600">{item.product.description}</p>
                    <p class="text-md font-semibold">Price: {item.product.price}</p>
                    <p class="text-md font-semibold">Quantity: {item.quantity}</p>
                    <button class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-2 py-1.5" on:click={removeFromCart}>
                        <i class="fas fa-trash-alt mr-1"></i>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    </div>
{:else}
    <p>This product is no longer available.</p>
{/if}








