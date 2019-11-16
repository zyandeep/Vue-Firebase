import Welcome from "./components/Welcome.vue";
import SignUp from "./components/SignUp.vue";
import SignIn from "./components/SignIn.vue";
import Dashboard from "./components/Dashboard.vue";

export default
[
  { name: "home",  path: "/", component: Welcome },
  { name: "signUp", path: "/sign-up", component: SignUp },
  { name: "signIn", path: "/sign-in", component: SignIn },
  { 
    name: "dashboard", 
    path: "/user/dashboard", 
    component: Dashboard
  }
  
];