<script>
    import {BASE_URL} from "../store/urlDomain.js";
    import {onMount} from "svelte";
    import Carousel from 'svelte-carousel';
    import {checkAuthentication} from "../auth/auth.js";
    import {cartCount} from "../store/cartStore.js";


    let products = [];
    let search = '';
    let sort = 'price_asc'; // or 'price_desc'
    let username = "";
    let user;



    let isLiked = false;



    onMount(async () => {
        try {
            const response = await fetch($BASE_URL + "/products");
            if (response.status === 200) {
                products = await response.json();
            }
            user = await checkAuthentication();

        } catch (error) {
            console.error('Network Error:', error);
        }

    });


    $: filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
        switch (sort) {
            case 'price_asc':
                return a.price - b.price;
            case 'price_desc':
                return b.price - a.price;
            default:
                return 0;
        }
    });


    function toggleLike() {
        isLiked = !isLiked;
    }

    async function addToCart(productId) {




        if (!user) {
            console.log('User is not authenticated');
            return;
        }



        try {
            const response = await fetch($BASE_URL + `/carts/${user._id}`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json' // Add this line to set the request headers
                },
                body: JSON.stringify({
                    productId,
                })
            });

            if (response.ok) {
                console.log('Product added to cart successfully');
                cartCount.update(count => count + 1); // increment the count in the store
            } else {
                const responseData = await response.json();
                if (response.status === 400 && responseData.message === 'Product is already in the cart') {
                    console.log('Product is already in the cart');
                    alert('Product is already in the cart');
                } else {
                    console.log('Failed to add product to cart');
                }
            }
        } catch (error) {
            console.error('Failed to add product to cart:', error);
        }
    }





</script>

<div class="flex items-center justify-between mb-8">
    <h1 class="text-5xl">All products</h1>

    <div class="flex items-center gap-4">
        <input
                class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                bind:value={search}
                placeholder="Search products..."
        />

        <select
                class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                bind:value={sort}
        >
            <option value="price_asc">Lowest price first</option>
            <option value="price_desc">Highest price first</option>
        </select>
    </div>
</div>

<div class="grid grid-cols-3 gap-x-10 gap-y-10">
    {#each filteredProducts as product, index}
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
            <div class="mt-2 ml-8">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold">{product.name}</h2>
                    <div class="flex-grow"></div>
                    <div class="mr-7">
                        <p class="text-xs text-gray-500 mt-[-5]">Posted by: {product.username}</p>
                    </div>
                </div>
                <p class="text-sm text-gray-600">{product.description}</p>
                <div class="flex items-center">
                    <p class="text-md font-semibold mb-3">Price: ${product.price}</p>
                </div>
                <button class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1 text-center" on:click={() => addToCart(product._id)}>
                    Add to cart
                </button>
            </div>
        </div>
    {/each}
</div>

