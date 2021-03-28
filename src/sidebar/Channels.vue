<template>
  <div>
     <v-btn
      class="ma-2"
      outlined
      color="#007bff"
      @click="openModal"
    >
      Add Channel
    </v-btn>
    <!-- <button @click="openModal" class="btn btn-outline-primary">
      Add Channel
    </button> -->
    <!-- show list of channels -->
    <div class="mt-4">
      <button
        @click.prevent=""
        v-for="(channel, key) in channels"
        :key="key"
        class="list-group-item list-group-item-action"
        type="button"
        :class="{ active: setActiveChannel(channel) }"
        @click="changeChannel(channel)"
      >
        {{ channel.name }}
        <!-- <span
          v-if="
            getNotification(channel) > 0 && channel.id !== currentChannel.id"
            class="float-right" style="color:black;">
            {{ getNotification(channel) }}</span> -->

                        <v-chip
              v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id"
              color='#90CAF9'
              class="ml-0 mr-2 black--text float-right"
              label
              small
            >
              {{ getNotification(channel) }} new
            </v-chip>
      </button>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="channelModal">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-dark">Channel Name</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <form>
              <div class="form-group">
                <input
                  v-model="new_channel"
                  type="text"
                  id="new_channel"
                  name="new_channel"
                  placeholder="Channel name"
                  class="form-control"
                />
              </div>
              <!--errorrs -->
              <ul class="list-group" v-if="hasErrors">
                <li
                  class="list-group-item text-danger"
                  v-for="error in errors"
                  v-bind:key="error"
                >
                  {{ error }}
                </li>
              </ul>
            </form>
          </div>

          <div class="modal-footer">
                <v-btn
                rounded
                color="primary"
                dark
                data-dismiss="modal"
              >
                Cancel
              </v-btn>

                <v-btn
                rounded
                color="#1976D2"
                @click="addChannel"
                dark
              >
                Add Channel
              </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import database from "firebase/database";
import { mapGetters } from "vuex";
import mixin from '../mixins'

export default {
  name: "channels",

  data() {
    return {
      new_channel: "",
      errors: [],
      channelRef: firebase.database().ref("channels"),
      messageRef: firebase.database().ref("messages"),
      notifCount: [],
      channels: [],
      channel: null,
    };
  },

  mixins:[mixin],

  computed: {
    ...mapGetters(["currentChannel", "isPrivate"]),

    hasErrors() {
      return this.errors.length > 0;
    },
  },

  watch: {
    isPrivate() {
      if (this.isPrivate) {
        this.resetNotifications();
      }
    },
  },
  methods: {
    openModal() {
      $("#channelModal").appendTo("body").modal("show");
    },
    //add a channel
    addChannel() {
      this.errors = [];
      // get key to the newly creating channels
      let key = this.channelRef.push().key;
      console.log("newly creating channel key: ", key);
      //minimum info needed to create a new channel
      // id and name
      let newChannel = { id: key, name: this.new_channel };
      // create new channel
      this.channelRef
        .child(key)
        .update(newChannel)
        .then(() => {
          this.new_channel = "";
          $("#channelModal").modal("hide");
        })
        //error handling
        .catch((error) => {
          this.errors.push(error.message);
        });
    },
    addListeners() {
      this.channelRef.on("child_added", (snapshot) => {
        // console.log('listening channelsRef on child_added:', snapshot.val())
        this.channels.push(snapshot.val());

        //set current channel
        if (this.channels.length > 0) {
          //set the first one as current channel
          this.channel = this.channels[0];
          //dispatch current channel to store
          this.$store.dispatch("setCurrentChannel", this.channel); //pick the first one
        }
        //add count listener to manage the notifications
        this.addCountListener(snapshot.key);
      });
    },

    addCountListener(channelId) {
      this.messageRef.child(channelId).on("value", (snapshot) => {
        this.handleNotifications(
          channelId,
          this.currentChannel.id,
          this.notifCount,
          snapshot
        );
      });
    },

    getNotification(channel) {
      let notif = 0;
      this.notifCount.forEach((el) => {
        if (el.id === channel.id) {
          notif = el.notif;
        }
      });
      return notif;
    },

    //  handleNotifications(channelId, currentChannelId, notifCount, snapshot) {
    //         let lastTotal = 0;
    //         // find if channelId is already added to notifCount[]
    //         let index = notifCount.findIndex(el => el.id === channelId);
    //         // if found
    //         if (index != -1) {
    //             if (channelId !== currentChannelId) {
    //                 lastTotal = notifCount[index].total;

    //                 if (snapshot.numChildren() - lastTotal > 0) {
    //                     notifCount[index].notif = snapshot.numChildren() - lastTotal;
    //                 }
    //             }
    //             notifCount[index].lastKnownTotal = snapshot.numChildren();
    //         } else {
    //             // push to notifCount[]
    //             notifCount.push({
    //                 id: channelId,
    //                 total: snapshot.numChildren(),
    //                 lastKnownTotal: snapshot.numChildren(),
    //                 notif: 0
    //             });
    //         }
    // },
    // set active channel
    setActiveChannel(channel) {
      return channel.id === this.currentChannel.id;
    },
    //changeChanne
    changeChannel(channel) {
      // reset notifications
      this.resetNotifications();
      this.$store.dispatch("setPrivate", false);
      this.$store.dispatch("setCurrentChannel", channel);
      // set channel
      this.channel = channel;
    },

    // reset notifications
    resetNotifications() {
      let index = this.notifCount.findIndex((el) => el.id === this.channel.id);
      if (index !== -1) {
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal;
        this.notifCount[index].notif = 0;
      }
    },

    detachListeners() {
      this.channelRef.off();
      this.channels.forEach((el) => {
        this.messagesRef.child(el.id).off();
      });
    },
  },
  mounted() {
    this.addListeners();
  },
  beforeDestroy() {
    this.detachListeners();
  },
};
</script>
  