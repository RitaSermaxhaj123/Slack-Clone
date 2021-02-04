<template>
    <div>
        <button @click="openModal" class="btn btn-outline-primary">Add Channel</button>
        <!-- Modal -->
        <div class="modal fade" id="channelModal">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                
            <div class="modal-header">
                <h5 class="modal-title text-dark">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <input v-model="new_channel" type="text" id="new_channel" name="new_channel"
                        placeholder="Channel name" class="form-control" >
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button @click="addChannel" type="button" class="btn btn-primary">Add channel</button>
            </div>
            </div>
        </div>
    </div>
    
    
    </div>
</template>

<script>
import database from 'firebase/database'

    export default{
        name: 'channels',
        
        data(){
            return{
                new_channel:'',
                errors:[],
                channelRef: firebase.database().ref('channels')
            }
        },
        methods:{
            openModal(){
                $('#channelModal').appendTo("body").modal('show');
            },
            //add a channel
            addChannel(){
                // get key to the newly creating channels
                let key = this.channelRef.push().key
                console.log('newly creating channel key: ',key)
                
           }
        }
    
    }
</script>
