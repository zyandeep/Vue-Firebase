<template>

  <nav class="navbar navbar-expand-md navbar-dark bg-primary">
    <div class="container">

      <router-link to="/" class="navbar-brand" >
        <strong>Vue - Complete Guide</strong>
      </router-link>

      <div class="navbar-nav">
        <router-link to="/sign-up" class="nav-item nav-link">Sign Up</router-link>
        <router-link to="/sign-in" class="nav-item nav-link">Sign In</router-link>
        <router-link to="/user/dashboard" class="nav-item nav-link">Dashboard</router-link>
      </div>

    </div>
  </nav>

</template>

<script>
export default {};
</script>

<style>
</style>