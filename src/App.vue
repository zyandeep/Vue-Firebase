<template>
  <div>

    <header>
      <MyHeader />
    </header>

    <section>
      <div class="row justify-content-center">
        
       <router-view></router-view>

      </div>
    </section>

  </div>
</template>

<script>
import MyHeader from "./components/MyHeader.vue";

export default {
  components: {
    MyHeader
  }
};
</script>

<style>
</style>
