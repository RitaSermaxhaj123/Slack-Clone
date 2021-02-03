// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
