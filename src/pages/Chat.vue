  <template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 sidebar">
                    <sidebar> </sidebar>
                </div>
                <div class="col-md-8 content">
                    <messages></messages>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../sidebar/Sidebar'
import Messages from '../messages/Messages'

export default {
    name: 'chat',

    components:{Sidebar, Messages}
}
</script>

<style scoped>
    .sidebar{
        width:33.5%;
        display: block;
        float: left;
        position: fixed;
        height: 100%;
        margin-left: -9px;
        background-color: #2e0014;
        padding-top: 2em;
        /* overflow: scroll; */
        position:fixed; 
        overflow-y:scroll; 
        top:0; 
        bottom:0;
    }
    .content{
        width:66%;
        display: block;
        float:left;
        margin-left: 34%;
    }
</style>