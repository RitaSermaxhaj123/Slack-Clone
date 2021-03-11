<template>
  <div>
    <div class="text-light">
      <h4>Users</h4>
      <div class="mt-1">
        <button
          v-for="user in users"
          class="list-group-item list-group-item-action"
          type="button"
          :class="{ active: isActive(user) }"
          @click.prevent="changeChannel(user)"
        >
          <span
            :class="{
              'fa fa-circle online': isOnline(user),
              'fa fa-circle offline': !isOnline(user),
            }"
          >
          </span>

          <span>
            <img class="img rounded-circle" :src="user.avatar" height="20" />
            <span>
              <a :class="{ 'text-light': isActive(user) }" href="#">{{
                user.name
              }}</a
              ><span class="float-right" v-if="getNotification(user) >= 1">{{
                getNotification(user)
              }}</span></span
            >
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import database from "firebase/database";
import { mapGetters } from "vuex";
import mixin from "../mixins";

export default {
  name: "users",
  data() {
    return {
      users: [],
      usersRef: firebase.database().ref("users"),
      connectedRef: firebase.database().ref(".info/connected"),
      presenceRef: firebase.database().ref("presence"),
      privateMessagesRef: firebase.database().ref("privateMessages"),
      notifCount: [],
      channel: null,
    };
  },

  mixins: [mixin],

  computed: {
    ...mapGetters(["currentUser", "currentChannel", "isPrivate"]),
  },

  watch: {
    isPrivate() {
      if (!this.isPrivate) {
        this.resetNotifications();
      }
    },
  },

  methods: {
    // handleNotifications(channelId, currentChannelId, notifCount, snapshot) {
    //   let lastTotal = 0;
    //   // find if channelId is already added to notifCount[]
    //   let index = notifCount.findIndex((el) => el.id === channelId);
    //   // if found
    //   if (index != -1) {
    //     if (channelId !== currentChannelId) {
    //       lastTotal = notifCount[index].total;

    //       if (snapshot.numChildren() - lastTotal > 0) {
    //         notifCount[index].notif = snapshot.numChildren() - lastTotal;
    //       }
    //     }
    //     notifCount[index].lastKnownTotal = snapshot.numChildren();
    //   } else {
    //     // push to notifCount[]
    //     notifCount.push({
    //       id: channelId,
    //       total: snapshot.numChildren(),
    //       lastKnownTotal: snapshot.numChildren(),
    //       notif: 0,
    //     });
    //   }
    // },
    addListeners() {
      this.usersRef.on("child_added", (snapshot) => {
        if (this.currentUser.uid !== snapshot.key) {
          let user = snapshot.val();
          user["uid"] = snapshot.key;
          user["status"] = "offline";
          this.users.push(user);
        }
      });

      this.presenceRef.on("child_added", (snapshot) => {
        if (this.currentUser.uid !== snapshot.key) {
          // pass to user status method
          this.addStatusToUser(snapshot.key);

          let channelId = this.getChannelId(snapshot.key);

          this.privateMessagesRef.child(channelId).on("value", (snapshot) => {
            this.handleNotifications(
              channelId,
              this.currentChannel.id,
              this.notifCount,
              snapshot
            );
          });
        }
      });

      // presenceRef child_removed
      this.presenceRef.on("child_removed", (snapshot) => {
        if (this.currentUser.uid !== snapshot.key) {
          // pass to user status method
          this.addStatusToUser(snapshot.key, false);
          this.privateMessagesRef.child(this.getChannelId(snapshot.key)).off();
        }
      });

      this.connectedRef.on("value", (snapshot) => {
        //console.log('connected user:', snapshot)
        if (snapshot.val() === true) {
          let ref = this.presenceRef.child(this.currentUser.uid);
          ref.set(true);
          ref.onDisconnect().remove();
        }
      });
    },

    addStatusToUser(userId, connected = true) {
      let index = this.users.findIndex((user) => user.uid === userId);
      if (index !== -1) {
        if (connected === true) {
          this.users[index].status = "online";
        } else {
          this.users[index].status = "offline";
        }
        //connected === true ? this.user[index].status = 'online' : this.users[index] = 'offline'
      }
    },

    isOnline(user) {
      return user.status == "online";
    },

    getNotification(user) {
      let channelId = this.getChannelId(user.uid);
      let notif = 0;
      this.notifCount.forEach((el) => {
        if (el.id === channelId) {
          notif = el.notif;
        }
      });
      return notif;
    },
    resetNotifications(user = null) {
      let channelId = null;

      if (user !== null) {
        channelId = this.getChannelId(user.uid);
      } else {
        channelId = this.channel.id;
      }
      let index = this.notifCount.findIndex((el) => el.id === channelId);
      if (index !== -1) {
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal;
        this.notifCount[index].notif = 0;
      }
    },

    detachListeners() {
      this.usersRef.off();
      this.presenceRef.off();
      this.connectedRef.off();

      this.channels.forEach((el) => {
        this.messagesRef.child(el.id).off();
      });
    },

    changeChannel(user) {
      if (this.channel === null) {
        this.resetNotifications(user);
      } else {
        this.resetNotifications();
      }
      // to change channel, you need channel id
      // to get channel id, use getChannelId() method below
      let channelId = this.getChannelId(user.uid);
      // create channel object with id and name
      let channel = { id: channelId, name: user.name };
      this.channel = channel;
      this.$store.dispatch("setPrivate", true);
      this.$store.dispatch("setCurrentChannel", channel);
    },

    isActive(user) {
      let channelId = this.getChannelId(user.uid);
      return this.currentChannel.id === channelId;
    },

    getChannelId(userId) {
      return userId < this.currentUser.uid
        ? userId + "/" + this.currentUser.uid
        : this.currentUser.uid + "/" + userId;
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
<style scoped>
.online {
  color: green;
}
.offline {
  color: red;
}
</style>