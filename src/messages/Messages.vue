<template>
    <div>
        <!-- show single messages -->
        <single-message :messages="messages"></single-message>
        <!-- message form -->
        <message-form></message-form>
    </div>
</template>

<script>
import SingleMessage from './SingleMessage'
import MessageForm from './MessageForm'
import database from 'firebase/database'
import {mapGetters} from 'vuex'

export default {
    name: 'messages',

    components:{SingleMessage, MessageForm},

    data(){
        return{
            messagesRef: firebase.database().ref('messages'),
            privateMessagesRef:firebase.database().ref('privateMessages'),
            messages: [],
            channel: ''
        }
    },
    computed: {
        ...mapGetters(['currentChannel','currentUser','isPrivate'])
    },
    watch:{
        currentChannel : function(){
            this.messages = []
            this.addListeners()
            this.channel = this.currentChannel
        }
    },
    methods: {
        addListeners(){
            let ref = this.getMessagesRef()
            ref.child(this.currentChannel.id).on('child_added', (snapshot) => {
                let message = snapshot.val()
                message['id'] = snapshot.key
                this.messages.push(message)
                this.$nextTick(()=>{
                            $("html,body").scrollTop($(document).height());
                        })
            })
        },
        detachListeners(){
            if(this.channel !== null){
                this.messagesRef.child(this.channel.id).off()
            }
        },
        getMessagesRef(){
            if(this.isPrivate){
                return this.privateMessagesRef
            }
            else{
                return this.messagesRef
            }
        }
    },
    beforeDestroy(){
        this.detachListeners()
    }

}
</script>