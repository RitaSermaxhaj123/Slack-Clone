<template>
    <div>
        <div class="text-light">
            <h4>Users</h4>
            <ul class="nav flex-column">
                <li v-for="user in users" :key="user.uid">
                <span>
                    <img :src="user.avatar" height="20" class="img rounded-circle"/>
                    <span class="text-primary">
                        {{user.name}}
                    </span>
                </span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import database from 'firebase/database'
    import {mapGetters} from 'vuex'

export default {
    name:'users',
    data(){
        return {
            users:[],
            usersRef: firebase.database().ref('users')
        }
    },
    computed:{
        ...mapGetters(['currentUser'])
    },
    methods:{
        addListeners(){
            this.usersRef.on('child_added', (snapshot)=>{
                if(this.currentUser.uid !== snapshot.key){
                    let user = snapshot.val()
                    user['uid']= snapshot.key
                    user['status'] = 'offline'
                    this.users.push(user)
                }
            })
        },
        detachListeners(){
        
        }
    },
    mounted(){
        this.addListeners()
    },
    beforeDestroy(){
        this.detachListeners()
    }
}
</script>