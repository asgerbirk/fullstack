<script>
  import { Router, Route } from "svelte-navigator";
  import Home from "./pages/Home.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Register from "./pages/Register.svelte";
  import Login from "./pages/Login.svelte";
  import NotFound from "./errors/NotFound.svelte";
  import VerifyMail from "./pages/VerifyMail.svelte";
  import Account from "./pages/Account.svelte";
  import CreateProduct from "./pages/CreateProduct.svelte";
  import Products from "./pages/Products.svelte";
  import ChatBot from "./components/ChatBot.svelte";
  import Footer from "./components/Footer.svelte";
  import EditProductModal from "./pages/EditProductModal.svelte";
</script>



<Router>
  <Navbar/>
    <div class="container mx-auto px-4">
        <Route path="/" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/verify-email" component={VerifyMail} />
        <Route path="/account" component={Account} />
        <Route path="/createProduct" component={CreateProduct} />
        <Route path="/products" component={Products} />
        <Route path="/chatBot" component={ChatBot} />
        <Route path="/e/:productId" component={EditProductModal}/>
        <Route path="*" component={NotFound} />
    </div>

    <Footer/>
</Router>




