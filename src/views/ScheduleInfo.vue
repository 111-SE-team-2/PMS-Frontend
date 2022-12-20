<template>
  <v-container fill-height class="justify-center mt-10" style="width: 70%">
    <!-- schedule info -->
    <v-row>
      <v-col style="text-align: left">
        <v-edit-dialog @save="save" :return-value.sync="scheduleName">
          <div class="text-h3">{{ scheduleName }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="scheduleName"
              label="Edit Name"
            ></v-text-field>
          </template> </v-edit-dialog
      ></v-col>
    </v-row>
    <v-row>
      <v-col style="text-align: left">
        <v-edit-dialog @save="save" :return-value.sync="scheduleLocation">
          <div class="text-h5">Location: {{ scheduleLocation }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="scheduleLocation"
              label="Edit Location"
            ></v-text-field>
          </template> </v-edit-dialog
      ></v-col>
      <v-col style="text-align: left">
        <v-switch @change="save" :return-value.sync="scheduleIsVideoConferencing"
          label="isVideoConferencing"
          v-model="scheduleIsVideoConferencing"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="text-align: left">
        <v-edit-dialog @save="save" :return-value.sync="scheduleDescription">
          <div class="text-h5">Description: {{ scheduleDescription }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="scheduleDescription"
              label="Edit Description"
            ></v-text-field>
          </template> </v-edit-dialog
      ></v-col>
    </v-row>
    <!-- schedule info end -->
    <!-- schedule options -->
    
    <!-- schedule options end -->
  </v-container>
</template>

<script lang="ts">
import { editSchedule, getSchedule, getScheduleOptions } from "@/apis/schedule";
import Vue from "vue";

export default Vue.extend({
  components: {

  },
  data() {
    return {
      tab: null,
      scheduleId: Number(this.$route.params.scheduleId),
      scheduleName: "",
      scheduleLocation: "",
      scheduleDescription: "",
      scheduleIsVideoConferencing: false,
      scheduleOptions: [{ type: Object, id: "", name: "", test: "" }],
      msg: "",
      dialog: false,
      snackBar: false,
      snackBarTimeout: 5000,
      snackBarColor: "",
    };
  },
  async created() {
    this.scheduleOptions = (await getScheduleOptions(this.scheduleId))["data"];
    this.getScheduleInfo();
    console.log(this.scheduleOptions)
  },
  methods: {
    async getScheduleInfo() {
      const scheduleInfo = (await getSchedule(this.scheduleId))["data"];
      this.scheduleName = scheduleInfo.name;
      this.scheduleLocation = scheduleInfo.location;
      this.scheduleDescription = scheduleInfo.description;
      this.scheduleIsVideoConferencing = scheduleInfo.isVideoConferencing;
    },
    async save() {
      const result = await editSchedule(
        this.scheduleId,
        this.scheduleName,
        this.scheduleLocation,
        this.scheduleDescription,
        this.scheduleIsVideoConferencing
      );
      this.msg = result["data"].message;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
      await this.getScheduleInfo();
    },
  }
});
</script>

<style lang="scss">
.tab-item {
  width: 100%;
  height: 100%;
}
</style>
