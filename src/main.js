// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'
import store from './store'
import auth from 'firebase/auth'
import vuetify from '../plugins/vuetify'

Vue.config.productionTip = false

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCx0pU7zJg_9cbwlzHnacR8WWRaRqdoEG4",
  authDomain: "slack-clone-83e3b.firebaseapp.com",
  projectId: "slack-clone-83e3b",
  storageBucket: "slack-clone-83e3b.appspot.com",
  messagingSenderId: "851119436827",
  appId: "1:851119436827:web:6eec82f9844ed35837b4be"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.firebase = firebase;

const unsubscribe = firebase.auth().onAuthStateChanged(user=>{
  //dispatch user
  store.dispatch('setUser', user);

  new Vue({
    el: '#app',
    vuetify,
    router,
    store,
    components: { App },
    template: '<App/>'
  });

  //recursion
  unsubscribe()
})


