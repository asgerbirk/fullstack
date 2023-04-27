import {writable} from "svelte/store";

export const accessToken = writable(localStorage.getItem('jwt'));