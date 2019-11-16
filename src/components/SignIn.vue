<template>
  <div class="col-md-4 pt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <form v-on:submit.prevent="onFormSubmit">
          <div class="form-group">
            <label for="email">Email address:</label>
            <input type="email" class="form-control" id="email" required v-model.trim="email" />
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" class="form-control" id="password" required v-model="password" />
          </div>

          <button class="btn btn-outline-dark btn-lg" type="submit" v-bind:disabled="submitted">
            <span class="spinner-border text-danger" v-show="submitted"></span>

            <span v-show="!submitted">Submit</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import myFirebase from "../my-firebase.js";

const AUTH = myFirebase.auth();

export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false
    };
  },
  methods: {
    onFormSubmit() {
      // Input validation

      this.submitted = true;

      AUTH.signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          // Signed in successfully
          // Send to Dashboard

          this.$router.push({ name: "dashboard" })
        })
        .catch(error => {
          alert(error.message);
        })
        .finally(() => {
          this.submitted = false;
        });
    }
  },

  beforeRouteEnter(to, from, next) {
    // Get the Current User to check if it's already signed in

    AUTH.onAuthStateChanged(user => {
      if (user) {
        // User alreday signed in
        next({ name: "dashboard", query: { signedIn: true } });
      } 
      else {
        next();
      }
    });
  }
};
</script>

<style>
</style>