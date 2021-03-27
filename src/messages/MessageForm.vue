<template>
  <div class="p-2">
    <div class="messageform">
      <!-- Progress bar -->
      <div class="progress" v-if="uploadState !== null" >
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
        >
          {{ uploadLabel }}
        </div>
  
      </div>
      <form @submit.prevent="sendMessage">
        <div class="input-group mb-2">
          <input
            v-model.trim="message"
            name="message"
            id="message"
            placeholder="Type your text here..."
            class="form-control mb-4"
            autofocus
          />

          <div class="input-group-appeng">
            <v-btn
              class="ma-2 white--text "
              :loading="loading4"
              :disabled="loading4"
              color="#1976D2"
              @click="sendMessage"
            >
              Send
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
            <!-- <button
              @click="sendMessage"
              class="btn btn-primary mt-3"
              type="button"
            >
              &nbsp; Send &nbsp;
            </button> -->
            <!-- </div>
                <div class="input-group append"> -->
            <v-btn
              :loading="loading3"
              :disabled="uploadState == 'Uploading'"
              color="#757575"
              class="ma-2 white--text "
              @click.prevent="openFileModal"
            >
              Upload
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <!-- <button @click.prevent="openFileModal" :disabled="uploadState == 'Uploading'" class="btn btn-warning mt-3" type="button">Upload</button> -->
          </div>
        </div>
      </form>
      <!-- file modal -->
      <file-modal ref="file_modal"></file-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import FileModal from "./FileModal";
import uuidV4 from "uuid/V4";
import storage from "firebase/storage";

export default {
  name: "message-form",
  components: { FileModal },

  data() {
    return {
      message: "",
      errors: [],
      storageRef: firebase.storage().ref(),
      uploadTask: null,
      uploadState: null,
    };
  },
  computed: {
    ...mapGetters(["currentChannel", "currentUser", "isPrivate"]),

    //upload state
    uploadLabel() {
      switch (this.uploadState) {
        case "Uploading":
          return "Uploading in progress";
          break;
        case "Error":
          return "Error occured";
          break;
        case "Done":
          return "Upload completed";
          break;
        default:
          return "";
      }
    },
  },
  methods: {
    sendMessage() {

      // use some validation
      if (this.currentChannel !== null) {
        if (this.message.length > 0) {
          this.$parent
            .getMessagesRef()
            .child(this.currentChannel.id)
            .push()
            .set(this.createMessage())
            .then(() => {
              this.$nextTick(() => {
                $("html, body").scrollTop($(document).height());
              });
            })
            .catch((error) => {
              this.errors.push(error.message);
            });
          // reset message
          this.message = "";
        }
      }
    },

    createMessage(fileUrl = null) {
      // create message object to push to firebase
      let message = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid,
        },
      };
      if (fileUrl == null) {
        // either send message with content
        message["content"] = this.message;
      } else {
        // or send the message with image
        message["image"] = fileUrl;
      }
      return message;
    },

    uploadFile(file, metadata) {
      // console.log('file: ', file, ' metadata: ', metadata)
      if (file === null) return false;
      let pathToUpload = this.currentChannel.id;
      let ref = this.$parent.getMessagesRef();
      let filePath = this.getPath() + "/" + uuidV4() + ".jpg";
      this.uploadTask = this.storageRef.child(filePath).put(file, metadata);
      this.uploadState = "Uploading";
      // on upload state change
      this.uploadTask.on(
        "state_changed",
        (snapshot) => {
          // upload in progress
          let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          $(".progress-bar").css("width", percent + "%");
        },
        (error) => {
          // error
          this.errors.push(error.message);
          this.uploadState = "Error";
          this.uploadTask = null;
          // reset form
          this.$refs.file_modal.resetForm();
        },
        () => {
          // upload finished
          this.uploadState = "Done";

          // reset form
          this.$refs.file_modal.resetForm();
          // recover the url of file
          let fileUrl = this.uploadTask.snapshot.ref
            .getDownloadURL()
            .then((fileUrl) => {
              this.sendFileMessage(fileUrl, ref, pathToUpload);
            });
        }
      );
    },

    sendFileMessage(fileUrl, ref, pathToUpload) {
      ref
        .child(pathToUpload)
        .push()
        .set(this.createMessage(fileUrl))
        .then(() => {
          this.$nextTick(() => {
            $("html, body").scrollTop($(document).height());
          });
        })
        .catch((error) => {
          this.errors.push(error.message);
        });
    },

    // folder directory to store files in firebase storage
    getPath() {
      if (this.isPrivate) {
        return "chat/private/" + this.currentChannel.id;
      } else {
        return "chat/public";
      }
    },

    openFileModal() {
      $("#fileModal").appendTo("body").modal("show");
      console.log("openfilemodal");
    },
  },
  mounted() {
    $("hmtl, body").scrollTop($(document).height());
  },

  beforeDestroy() {
    if (this.uploadTask !== null) {
      this.uploadTask.cancel();
      this.uploadTask = null;
    }
  },
};
</script>
<style scoped>
* {
  margin: 0;
}
.messageform {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 67%;
  z-index: 100;
  color: white;
  text-align: center;
  margin-bottom: -20px;
  margin-left: 33.3%;
}
input,
button {
  height: 50px;
  top: 10px;
  left: 5px;
}
button {
  margin-right: -5px;
}
.progress {
  margin-bottom: -10px;
  margin-left:4px;

}
.v-btn {
  min-height: 50px;
}
.v-btn__content{
  color: white;
}
</style>