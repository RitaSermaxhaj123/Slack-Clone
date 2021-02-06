<template>
    <div>
        <!-- show single messages -->
        <single-message></single-message>
        <!-- message form -->
        <message-form></message-form>
    </div>
</template>

<script>
import SingleMessage from './SingleMessage'
import MessageForm from './MessageForm'
import database from 'firebase/database'

export default {
    name: 'messages',

    components:{SingleMessage, MessageForm},

    data(){
        return{
            messagesRef: firebase.database().ref('messages')
        }
    }

}
</script>