<template>
    <div>
        <div class="jumbotron bg-primary text-white text-center">
            <h2 class="lead display-3">#SLACK#</h2>
            <p>Realtime communication at it's best</p>
        </div>

        <!-- Show laoding status -->
        <div class="alert alert-info text-center" v-if="loading">
            Proccesing...
        </div>

        <!-- Show errors -->
        <div class="alert alert-danger text-center" v-if="hasErrors">
            <div v-for="error in errors" v-bind:key="error">{{ error }}</div>
        </div>
        
        <div class="container-fluid">
            <div class="row mt-5">
                <div class="col text-center">
                    <button @click="loginWithGoogle" class="btn btn-outline-danger btn-lg">&nbsp;Login with Google &nbsp;&nbsp;<i class="fab fa-google"></i></button>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col text-center">
                    <button @click="loginWithFacebook" class="btn btn-outline-info btn-lg">Login with Facebook&nbsp;&nbsp;<i class="fab fa-facebook-f"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import auth from 'firebase/auth'
import database from 'firebase/database'
export default {
    name: 'login',
    data(){
        return{
            errors: [],
            loading: false,
            usersRef: firebase.database().ref('users')
        }
    },
    computed:{
        hasErrors(){
            return this.errors.length > 0;
        }
    },
    methods:{
        loginWithGoogle(){
            this.loading = true;
            this.errors = [];
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((response) => {
                // console.log(response.user);
                
                //pass user to save in db
                this.saveUserToUserRef(response.user)
                
                //dispatch setUser action
                this.$store.dispatch('setUser', response.user);
                this.$router.push('/');
            }).catch(error=>{
                this.errors.push(error.message);
                this.loading = false;
            })
        },
        //save user to database
        saveUserToUserRef(user){
            return this.usersRef.child(user.uid).set({
                name: user.displayName,
                avatar: user.photoURL
            })
        },
        loginWithFacebook(){
            this.loading = true;
            this.errors = [];
            firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then((response) => {
                 // console.log(response.user);

                //dispatch setUser action
                this.$store.dispatch('setUser', response.user);
                this.$router.push('/');
            }).catch(error=>{
                this.errors.push(error.message);
                this.loading = false;
            })
        }
    }
}
</script>

<style scoped>
    .btn, .jumbotron{
        border-radius: 0px;
    }
    .jumbotron {
        margin-bottom: 0 !important;
        background-color: #065a82!important;
    }
</style>