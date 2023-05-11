import Cookies from 'js-cookie';

export function getCookie(name) {
    return Cookies.get(name);
}

export function setCookie(name, value, options) {
    Cookies.set(name, value, options);
}

export function removeCookie(name) {
    console.log(`Removing cookie: ${name}`);
    Cookies.remove(name);
}