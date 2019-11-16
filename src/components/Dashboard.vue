<template>
  <div class="col pt-4 text-center">
    <h2>That's the Dashboard!</h2>
    <p class="text-danger font-weight-bold">You should only get here if you're authenticated!</p>

    <!-- User Info -->
    <span class="spinner-border text-danger" v-if="!userData"></span>
    <p v-else>{{ userData }}</p>
   
    <hr />

    <button type="button" class="btn btn-outline-dark btn-lg" v-on:click="onSignOut">Sign Out</button>
  </div>
</template>

<script>
import myFirebase from "../my-firebase.js";

const AUTH = myFirebase.auth();
const DB = myFirebase.db();

export default {
  data() {
    return {
      userData: null
    };
  },

  methods: {
    onSignOut() {
      AUTH.signOut()
        .then(() => {
          // Signed out successfully

          this.$router.push({ name: "home" });
        })
        .catch(error => {
          alert(error.message);
        });
    }
  },

  mounted() {
    const docRef = DB.collection("users").doc(AUTH.currentUser.uid);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          this.userData = doc.data();
        }
        else {
          this.userData = "No user info found!";
        } 
      })
      .catch(error => {
        console.log("[FireStore Error] ", error);
      });
  },

  beforeRouteEnter(to, from, next) {
    // Check if user has signed in

    AUTH.onAuthStateChanged(user => {
      if (user) {
        // Send user
        next();
      } 
      else {
        next("/");
      }
    });
  }
};
</script>

<style>
</style>