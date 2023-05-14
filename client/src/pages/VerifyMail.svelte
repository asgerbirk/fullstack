<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-navigator';
    import {BASE_URL} from "../store/urlDomain.js";
    import Swal from 'sweetalert2';

    let token = '';

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token');
        if (token) {
            try {
                const response = await fetch(`${BASE_URL}/verify-email?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Email verified successfully!',
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        navigate('/'); // redirect to home or login page
                    });
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Verification failed. Invalid or expired token.',
                        showConfirmButton: true,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    });
</script>

<div class="flex justify-center items-center h-screen">
    <div>Verifying email...</div>
</div>
