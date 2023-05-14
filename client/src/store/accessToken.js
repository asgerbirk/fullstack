import { writable } from 'svelte/store';
import { getCookie, removeCookie, setCookie } from '../utils/cookieUtils';

export const accessToken = writable(getCookie('jwt'));
export const isLoggedIn = writable(!!getCookie('jwt'));

accessToken.subscribe(value => {
    setCookie('jwt', value, { expires: 1 });
    isLoggedIn.set(!!value);
});

export function removeAccessToken() {
    accessToken.set(null);
    removeCookie('jwt');
}

export function updateLoggedInStatus(status) {
    isLoggedIn.set(!!status);
}



