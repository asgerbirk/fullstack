<script>
    import { onMount } from 'svelte';
    import { BASE_URL } from '../store/urlDomain.js';
    import CartItem from "./CartItem.svelte";
    import {checkAuthentication} from "../auth/auth.js";
    import {cartCount} from "../store/cartStore.js";


    let cartItems = [];
    let totalPrice = 0;

    onMount(async () => {
        try {
            const user = await checkAuthentication();
            if (user) {
                const response = await fetch($BASE_URL + `/carts/${user._id}`, {
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Response data:', data); // Log the response data
                    cartItems = data.items;
                    console.log('Cart items:', cartItems); // Log the cart items after assignment
                    cartCount.set(cartItems.length);
                    calculateTotalPrice();

                } else {
                    console.error('Failed to fetch cart');
                }
            } else {
                console.error('User is not authenticated');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    });
   function calculateTotalPrice() {
       totalPrice = 0;
       for (let i = 0; i < cartItems.length; i++) {
           const item = cartItems[i];
           if (item.product && item.product.price) {
               totalPrice += item.product.price * item.quantity;
           }
       }
   }
</script>
<h1 class="text-2xl font-bold mb-4 md:mb-0 text-center">Your Cart</h1>
<div class="cart flex flex-col md:flex-row md:justify-between bg-gray-200 p-4 rounded shadow">


    {#if cartItems.length === 0}
        <p>Your cart is empty.</p>
    {:else}
        <div class="cart-items w-full md:w-3/4">
            {#each cartItems as item (item._id)}
                <CartItem {item} totalPrice={totalPrice} />
            {/each}
        </div>

        <div class="total-price text-right md:self-center md:ml-4 bg-white p-4 rounded shadow">
            <p class="text-lg font-semibold">Total Price: {totalPrice}</p>
        </div>

        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 md:mt-0" >Checkout</button>
    {/if}
</div>

