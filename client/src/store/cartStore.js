import { writable } from "svelte/store";

// Initialize cartCount from localStorage if it's there
const initialCartCount = localStorage.getItem('cartCount')
    ? JSON.parse(localStorage.getItem('cartCount'))
    : 0;

export const cartCount = writable(initialCartCount);

// Subscribe to changes in cartCount and save them to localStorage
cartCount.subscribe(value => {
    localStorage.setItem('cartCount', JSON.stringify(value));
});