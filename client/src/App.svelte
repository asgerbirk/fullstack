<script>
  import { Router, Route } from "svelte-navigator";
  import Home from "./pages/Home.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Register from "./pages/Register.svelte";
  import Login from "./pages/Login.svelte";
  import NotFound from "./errors/NotFound.svelte";
  import VerifyMail from "./pages/VerifyMail.svelte";
</script>



<Router>
  <Navbar/>
    <div class="container mx-auto px-4">
        <Route path="/" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/verify-email" component={VerifyMail} />
        <Route path="*" component={NotFound} />
    </div>
</Router>




