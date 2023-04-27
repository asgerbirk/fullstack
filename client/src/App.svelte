<script>
  import { Router, Route } from "svelte-navigator";
  import Home from "./components/Home.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Register from "./components/Register.svelte";
  import Login from "./components/Login.svelte";
</script>



<Router>
  <Navbar/>
    <div class="container mx-auto px-4">
        <Route path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
    </div>
</Router>




