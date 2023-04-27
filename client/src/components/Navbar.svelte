<script>
    import {Link} from "svelte-navigator";
</script>

<nav class="bg-gray-800 py-4">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
            <Link to="/" class="text-white font-bold text-lg">
                Home
            </Link>
            <Link to="/login" class="text-white hover:text-gray-400 text-lg">
                Login
            </Link>
        </div>
    </div>
</nav>