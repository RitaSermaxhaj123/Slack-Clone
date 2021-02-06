<template>
    <div class="p-2">
        <div class="messageform">
            <form>
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
export default {
    name: 'message-form',

    data(){
        return{
            message: '',
            errors:[]
        }
    },
    methods:{
        sendMessage() {
            console.log('send')
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