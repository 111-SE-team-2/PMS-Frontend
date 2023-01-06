<template>
    <v-container fill-height>
      <v-row class="d-flex justify-center">
        <v-tabs v-model="tab" background-color="transparent" color="basil" @change="save">
          <v-tab><img src="../assets/edit.png"></v-tab>
          <v-tab><img src="../assets/editable.png"></v-tab>
          <v-tab><img src="../assets/preview.png"></v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="tab-item">
          <v-tab-item
            ><v-md-editor v-model="meetingMinuteContent" height="800px" tab-size=4 mode="edit" @save="save"></v-md-editor></v-tab-item>
          <v-tab-item
            ><v-md-editor v-model="meetingMinuteContent" height="800px" tab-size=4 mode="editable" @save="save"></v-md-editor></v-tab-item>
          <v-tab-item
            ><v-md-editor v-model="meetingMinuteContent" height="800px" tab-size=4 mode="preview" @save="save"></v-md-editor></v-tab-item>
        </v-tabs-items>
      </v-row>
      <v-snackbar
        v-model="snackBar"
        :timeout="snackBarTimeout"
        :color="snackBarColor"
      >{{ msg }}</v-snackbar>
    </v-container>
  </template>
  
  <script lang="ts">
  import { editMeetingMinute, getMeetingMinute } from "@/apis/meetingMinute";
import Vue from "vue";
  
  export default Vue.extend({
    components: {},
    data() {
      return {
        meetingMinuteId: Number(this.$route.params.meetingMinuteId),
        meetingMinuteTitle: "",
        meetingMinuteContent: "",
        msg: "",
        dialog: false,
        snackBar: false,
        snackBarTimeout: 5000,
        snackBarColor: "",
        tab: 0
      };
    },
    async created() {
      this.getMeetingMinuteInfo();
    },
    methods: {
      async getMeetingMinuteInfo() {
        const meetingMinuteInfo = (await getMeetingMinute(this.meetingMinuteId))["data"];
        this.meetingMinuteTitle = meetingMinuteInfo.title;
        this.meetingMinuteContent = meetingMinuteInfo.content;
      },
      async save(text: string, html: string) {
        const result = await editMeetingMinute(
          this.meetingMinuteId,
          this.meetingMinuteTitle,
          this.meetingMinuteContent
        );
        this.msg = result["data"].message;
        this.snackBar = true;
        this.snackBarColor = result["data"].success ? "green" : "red";
        await this.getMeetingMinuteInfo();
      },
    }
  });
  </script>
  
  <style lang="scss">
  .tab-item {
    width: 100%;
    height: 100%;
  }
  
  .container-background-color {
    background-color: rgb(247, 247, 247) !important;
  }

  .CodeMirror { text-align: left!important; }
  </style>
  