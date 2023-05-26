<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import Carousel from "svelte-carousel";





    // Replace exported close function with a function to toggle the modal
    export let showModal = false;

    export let product;

    let image = "";
    let name = "";
    let description = "";
    let price = "";

    const dispatch = createEventDispatcher();

    async function handleUpdate(productId) {
        try {
            const updatedProduct = {
                name,
                description,
                price
            };

            const response = await fetch(`http://localhost:8080/products/${productId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (response.status === 200) {
                const updatedProductFromServer = await response.json();
                console.log('Product updated successfully');
                dispatch('update', updatedProductFromServer);
                return updatedProductFromServer;
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    function handleSubmit() {
        handleUpdate(product._id);
        console.log(product._id)
        showModal = false;
    }


    // Initialize the variables with the initial product values
    onMount(() => {
        image = product.imageUrls || "";
        name = product.name || "";
        description = product.description || "";
        price = product.price || "";
    });
</script>


{#if showModal}
    <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="modal-overlay bg-black opacity-50"></div>
        <div class="modal-container bg-white rounded-lg shadow-lg max-w-xl">
            <form on:submit={handleSubmit} class="modal-content p-8">

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

                <div class="mb-8">
                    <label for="name" class="block text-gray-700 font-bold text-lg mb-2">Name:</label>
                    <input type="text" id="name" class="form-input w-full text-lg" bind:value={name} />
                </div>

                <div class="mb-8">
                    <label for="description" class="block text-gray-700 font-bold text-lg mb-2">Description:</label>
                    <textarea id="description" class="form-textarea w-full text-lg" bind:value={description}></textarea>
                </div>

                <div class="mb-8">
                    <label for="price" class="block text-gray-700 font-bold text-lg mb-2">Price:</label>
                    <input type="number" id="price" class="form-input w-full text-lg" bind:value={price} />
                </div>

                <div class="flex justify-between">
                    <button type="button" on:click={() => showModal = false} class="bg-red-600 text-white font-bold py-2 px-4 rounded">Cancel</button>
                    <button type="submit" class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Update</button>
                </div>
            </form>
        </div>
    </div>
{/if}







