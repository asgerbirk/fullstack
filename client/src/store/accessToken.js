import { writable } from 'svelte/store';
import { getCookie, removeCookie, setCookie } from '../utils/cookieUtils';
import {cartCount} from "./cartStore.js";

export const accessToken = writable(getCookie('jwt'));
export const isLoggedIn = writable(getCookie('jwt') ? true : false);

accessToken.subscribe(value => {
    setCookie('jwt', value, { expires: 1 });
    isLoggedIn.set(!!value);
});

export function removeAccessToken() {
    accessToken.set(null);
    removeCookie('jwt');
    cartCount.set(0);
    localStorage.removeItem('cartCount');
}




