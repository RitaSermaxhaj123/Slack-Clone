<template>
    <div class="p-2">
        <div class="messageform">
            <!-- Progress bar -->
            <div class="progress" v-if="uploadState !== null">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar">
                    {{uploadLabel}}
                </div>
            </div>
            <form @submit.prevent="sendMessage">
                <div class="input-group mb-2">
                    <input v-model.trim="message" name="message" id="message" placeholder="write something" class="form-control mb-4" autofocus>
                
                <div class="input-group-appeng">
                    <button @click="sendMessage" class="btn btn-primary mt-3" type="button">&nbsp; Send &nbsp;</button>
                <!-- </div>
                <div class="input-group append"> -->
                    <button @click.prevent="openFileModal" class="btn btn-warning mt-3" type="button">Upload</button>
                </div>
                </div>
            </form>
            <!-- file modal -->
            <file-modal></file-modal>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import FileModal from './FileModal'
import uuidV4 from 'uuid/v4'
import storage  from 'firebase/storage'

export default {
    name: 'message-form',
    components: {FileModal},

    data(){
        return{
            message: '',
            errors:[],
            storageRef: firebase.storage().ref(),
            uploadTask: null,
            uploadState: null
        }
    },
    computed:{
        ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),

        //upload state
        uploadLabel(){
            switch(this.uploadState){
                case 'Uploading': return 'Uploading in progress'
                    break
                case 'Error': return 'Error occured'
                    break
                case 'Done': return 'Upload completed'
                    break
                default:return ''
            }
        }
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
        },
        uploadFile(file, metadata){
            if(file === null) return false;

            let pathToUpload = this.currentChannel.id
            let ref = this.$parent.getMessagesRef()
            let filePath = this.getPath() + '/' + uuidV4 +'.jpg'

            this.uploadTask = this.storageRef.child(filePath).put(file, metadata)
            this.uploadState = "Uploading"

            // on upload state change
            this.uploadTask.on('state_changed', snapshot => {
                // upload in progress
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                $(".progress-bar").css("width", percent+'%')
            }, error => {
                // error
                this.errors.push(error.message)
                this.uploadState = 'Error'
                this.uploadTask = null;
            }, () => {
                // upload finished
                this.uploadState = 'Done'

                //recover the url of file
            })
        },

        // folder directory to store files in firebase storage
        getPath(){
            if(this.isPrivate){
                return 'chat/private/'+ this.currentChannel.id
            } else{
                return 'chat/public'
            }
        },

        openFileModal(){
           $("#fileModal").appendTo("body").modal('show');
        //    console.log('openfilemodal'); 
        }
    },
    mounted(){
        $("hmtl, body").scrollTop($(document).height());
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
        margin-bottom:-20px ;
        margin-left: 33.3%;
    }
    input,button{
        height: 50px;
        top: 16px;   
    }
    button{
        margin-right: -5px;
    }
    .progress{
        margin-bottom: -16px ;
    }
</style>