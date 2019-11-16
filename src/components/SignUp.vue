<template>
  <div class="col-md-4 py-2">
    <div class="card shadow-sm">
      <div class="card-body">
        <form v-on:submit.prevent="onFormSubmit">
          <div class="form-group">
            <label for="email">Email address:</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model.trim="user.email"
              v-on:change="$v.user.email.$touch()"
              v-bind:class="emailClass"
            />
            <small
              class="form-text text-danger"
              v-show="$v.user.email.$error"
            >Please, enter a valid email.</small>
          </div>

          <div class="form-group">
            <label for="age">Your Age:</label>
            <input
              type="text"
              class="form-control"
              id="age"
              v-model.number="user.age"
              v-on:input="$v.user.age.$touch()"
              v-bind:class="ageClass"
            />

            <small
              class="form-text text-muted"
              v-show="$v.user.age.$error"
            >You have to be atleast {{ $v.user.age.$params.minValue.min }}+ years.</small>
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="user.pwd"
              v-on:change="$v.user.pwd.$touch()"
              v-bind:class="{ 'is-invalid': $v.user.pwd.$error }"
            />
          </div>

          <div class="form-group">
            <label for="conf-password">Confirm Password:</label>
            <input
              type="password"
              class="form-control"
              id="conf-password"
              v-model="user.confPwd"
              v-on:input="$v.user.confPwd.$touch()"
              v-bind:class="{ 'is-invalid': $v.user.confPwd.$error }"
            />
          </div>

          <div class="form-group">
            <label for="country">Country:</label>
            <select class="form-control" id="country" v-model="user.country">
              <option value>*** Pick a Country ***</option>
              <option value="usa">USA</option>
              <option value="india">India</option>
              <option value="uk">UK</option>
              <option value="germany">Germany</option>
            </select>
          </div>

          <div class="form-group">
            <h6>Add some Hobbies</h6>
            <input
              type="button"
              class="btn btn-primary mb-2"
              value="Add Hobby"
              v-on:click="btnClick++"
            />

            <p v-for="i in btnClick" v-bind:key="i">
              <input
                type="text"
                v-bind:placeholder=" `Hobby #${i}` "
                v-on:input="$v.user.hobbies.$touch()"
                v-model.trim="user.hobbies[i-1]"
              />
              <span class="ml-2 remove-hobby" v-on:click="removeHobby(i-1)">❌</span>
            </p>
          </div>

          <div class="form-group form-check">
            <input
              type="checkbox"
              id="cbox"
              class="form-check-input"
              v-model="user.accept"
              v-on:change="$v.user.accept.$touch()"
              v-bind:class="{ 'is-invalid': $v.user.accept.$error }"
            />

            <label class="form-check-label" for="cbox">Accept Terms of Use</label>
          </div>

          <button class="btn btn-outline-dark btn-lg" type="submit" v-bind:disabled="submitted">
            <div v-show="submitted">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </div>

            <span v-show="!submitted">Submit</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import myFirebase from "../my-firebase.js";
import {
  required,
  email,
  numeric,
  minValue,
  minLength,
  sameAs,
  helpers
} from "vuelidate/lib/validators";

// Add necessary firebase service
const DB = myFirebase.db();
const AUTH = myFirebase.auth();

export default {
  data() {
    return {
      btnClick: 0,
      submitted: false,
      user: {
        email: "",
        age: null,
        pwd: "",
        confPwd: "",
        country: "",
        hobbies: [],
        accept: false
      }
    };
  },

  computed: {
    emailClass() {
      return {
        "is-invalid": this.$v.user.email.$error,
        "is-valid": this.$v.user.email.$dirty && this.$v.user.email.email
      };
    },
    ageClass() {
      return {
        "is-invalid": this.$v.user.age.$error,
        "is-valid": this.$v.user.age.$dirty && this.$v.user.age.minValue
      };
    }
  },

  methods: {
    removeHobby(index) {
      this.btnClick--;
      this.user.hobbies.splice(index, 1);
    },
    onFormSubmit() {
      // Input validation required

      if (this.$v.$invalid) {
        window.alert("Please fill up the form correctly!");
        return;
      }

      this.submitted = true;

      // Sign up the user with Firebase

      AUTH.createUserWithEmailAndPassword(this.user.email, this.user.pwd)
        .then(({ user }) => {
          //  Create a New User Document
          return DB.collection("users")
            .doc(user.uid)
            .set({
              email: this.user.email,
              age: this.user.age,
              pwd: this.user.pwd,
              country: this.user.country,
              hobbies: this.user.hobbies,
              accept: this.user.accept
            });
        })
        .then(() => {
          // User registered successfully

          this.$router.push({ name: "signIn" });
        })
        .catch(error => {
          alert(error.message);
        })
        .finally(() => {
          // Stop loader...
          this.submitted = false;

          this.btnClick = 0;

          // Reset form fields
          this.user.email = "";
          this.user.age = null;
          this.user.pwd = "";
          this.user.confPwd = "";
          this.user.country = "";
          this.user.hobbies = [];
          this.user.accept = false;
        });
    }
  },

  validations: {
    user: {
      email: {
        required,
        email,
        isUnique(value) {
          // Sync validation returns True

          if (value === "") {
            return true;
          }

          // Run aync code
          return DB.collection("users")
            .where("email", "==", value)
            .get()
            .then(querySnapshot => {

              if (querySnapshot.empty) {
                 // no doc exits

                return new Promise((resolve, reject) => {
                  resolve(true);
                });
              } 
              else {
                 // doc already exist

                return new Promise((resolve, reject) => {
                  reject();
                });
              }
            })
            .catch(error => { 
              return new Promise((resolve, reject) => {
                reject(false);
              });
            });
        }
      },
      age: {
        required,
        numeric,
        minValue: minValue(18)
      },
      pwd: {
        required,
        minLen: minLength(6)
      },
      confPwd: {
        sameAs: sameAs(vm => {
          return vm.pwd;
        })
      },
      accept: {
        myValid: (value, vm) => {
          if (vm.country === "germany") {
            return true;
          } else {
            return value;
          }
        }
      },
      hobbies: {
        required,

        myArr: value => {
          // check each value of the array can't be empty

          if (helpers.len(value)) {
            let isOK = true;

            value.forEach(item => {
              if (!helpers.len(item)) {
                isOK = false;
              }
            });

            return isOK;
          } else {
            return false;
          }
        }
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    AUTH.onAuthStateChanged(user => {
      if (user) {
        // User alreday signed in
        next({ name: "dashboard", query: { signedIn: true } });
      } else {
        next();
      }
    });
  }
};
</script>

<style scoped>
.remove-hobby {
  cursor: pointer;
}
</style>