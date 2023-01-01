<template>
    <v-container fill-height style="width: 70%">
      <v-row class="d-flex justify-center">
        <!-- meeting minute info -->
        <!-- meeting minute info end -->
      </v-row>
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
      async save() {
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
  </style>
  