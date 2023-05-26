import { writable } from 'svelte/store';
import { getCookie, removeCookie, setCookie } from '../utils/cookieUtils';

export const accessToken = writable(getCookie('jwt'));
export const isLoggedIn = writable(getCookie('jwt') ? true : false);

accessToken.subscribe(value => {
    setCookie('jwt', value, { expires: 1 });
    isLoggedIn.set(!!value);
});

export function removeAccessToken() {
    accessToken.set(null);
    removeCookie('jwt');
}




