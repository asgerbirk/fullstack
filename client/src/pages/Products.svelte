<script>
    import {BASE_URL} from "../store/urlDomain.js";
    import {onMount} from "svelte";
    import Carousel from 'svelte-carousel';
    import ChatBot from "../components/ChatBot.svelte";

    let products = [];
    let search = '';
    let sort = 'price_asc'; // or 'price_desc'
    let username = "";
    let user;


    onMount(async () => {
        try {
            const response = await fetch($BASE_URL + "/products");
            if (response.status === 200) {
                products = await response.json();
            }
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
            <div class="mt-2">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold">{product.name}</h2>
                    <p class="text-xs text-gray-500">Posted by: {product.username}</p>
                </div>
                <p class="text-sm text-gray-600">{product.description}</p>
                <p class="text-md font-semibold">Price: ${product.price}</p>
            </div>
        </div>
    {/each}
</div>

