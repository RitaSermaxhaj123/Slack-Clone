<template>
    <div>
        <h2 class="text-light">#SLACK#</h2>
        <hr style="border: 1px solid #f1e0c5;">
        <span>
            <img class="rounded-circle mr-2" height="30" :src="currentUser.photoURL" />
            <span class="test-light">{{ currentUser.displayName}}</span>
        </span>

        <hr style="border: 1px solid #f1e0c5;">

        <button @click="logout" class="btn btn-outline-light">
            Logout
        </button>     
        
        <hr style="border: 1px solid #f1e0c5;">

        <channels> </channels>
        <hr style="border: 1px solid #f1e0c5;">
        <users></users>
    </div>
</template>

<script>
import auth from 'firebase/auth'
import {mapGetters} from 'vuex'
import Channels from './Channels'
import Users from './Users'

export default {
    name: 'sidebar',
    
    components: {Channels,Users},
    
    computed:{
        ...mapGetters(['currentUser'])
    },
    methods:{
        logout(){
            firebase.auth().signOut();
            this.$store.dispatch('setUser', null);
            this.$router.push('/login');
        }
    }
}
</script>
