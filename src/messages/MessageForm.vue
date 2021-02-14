<template>
    <div class="p-2">
        <div class="messageform">
            <form @submit.prevent="sendMessage">
                <div class="input-group mb-2">
                    <input v-model.trim="message" name="message" id="message" placeholder="write something" class="form-control mb-4" autofocus>
                
                <div class="input-group-appeng">
                    <button @click="sendMessage" class="btn btn-primary mt-3" type="button">&nbsp; Send &nbsp;</button>
                <!-- </div>
                <div class="input-group append"> -->
                    <button class="btn btn-warning mt-3" type="button">Upload</button>
                </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: 'message-form',

    data(){
        return{
            message: '',
            errors:[]
        }
    },
    computed:{
        ...mapGetters(['currentChannel', 'currentUser'])
    },
    methods:{
        sendMessage() {
            // construct new messages object
            let newMessage ={
                content: this.message,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: { 
                    name: this.currentUser.displayName,
                    avatar:this.currentUser.photoURL,
                    id: this.currentUser.uid
                }
            }
            // use some validation
            if(this.currentChannel !==null){
                if(this.message.length > 0){
                    this.$parent.getMessagesRef().child(this.currentChannel.id).push().set(newMessage)
                    .then(() => {
                        this.$nextTick(()=>{
                            $("html,body").scrollTop($(document).height());
                        })
                    })
                    .catch((error) => {
                        this.errors.push(error.message)
                    })
                    //reset message
                    this.message=''
                }
            }
        }
    }

}
</script>
<style scoped>
    *{
        margin: 0;
    }
    .messageform{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 67%;
        z-index: 100;
        color: white;
        text-align: center;
        margin-bottom:-16px ;
        margin-left: 33.3%;
    }
    input,button{
        height: 50px;
        top: 16px;   
    }
    button{
        margin-right: -5px;
    }
</style>