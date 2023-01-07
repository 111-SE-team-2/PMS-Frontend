<template>
  <v-container fill-height style="width: 70%">
    <v-row class="d-flex justify-center">
      <!-- schedule info -->
      <v-col lg="3">
        <v-card max-width="400" height="700" class="pt-5">
          <v-card-text>
            <v-row class="d-flex justify-center">
              <v-edit-dialog @save="save" :return-value.sync="scheduleTitle">
              <div class="text-h4">{{ scheduleTitle }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="scheduleTitle"
                  label="Edit Title"
                ></v-text-field>
              </template> </v-edit-dialog>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-switch @change="save" :return-value.sync="scheduleIsVideoConferencing"
                label="isVideoConferencing"
                v-model="scheduleIsVideoConferencing"
              ></v-switch>
            </v-row>
            <v-row class="d-flex justify-center">
              <img src="../assets/location.png">
              <span class="text-h6">Location:</span>
              <v-edit-dialog @save="save" :return-value.sync="scheduleLocation">
              <div class="text-h6 container-background-color">{{ scheduleLocation }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="scheduleLocation"
                  label="Edit Location"
                ></v-text-field>
              </template> </v-edit-dialog>
            </v-row>
            <v-row class="d-flex justify-center">
              <img src="../assets/description.png">
              <span class="text-h6">Description:</span>
              <v-edit-dialog @save="save" :return-value.sync="scheduleDescription">
              <div class="text-h6 container-background-color">{{ scheduleDescription }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="scheduleDescription"
                  label="Edit Description"
                ></v-text-field>
              </template> </v-edit-dialog>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- schedule info end -->
      <v-col lg="9">
        <ScheduleOptionTable/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { editSchedule, getSchedule } from "@/apis/schedule";
import ScheduleOptionTable from "@/components/ScheduleOptionTable.vue";
import Vue from "vue";

export default Vue.extend({
  components: {
    ScheduleOptionTable
  },
  data() {
    return {
      scheduleId: Number(this.$route.params.scheduleId),
      scheduleTitle: "",
      scheduleLocation: "",
      scheduleDescription: "",
      scheduleIsVideoConferencing: false,
      msg: "",
      dialog: false,
      snackBar: false,
      snackBarTimeout: 5000,
      snackBarColor: "",
    };
  },
  async created() {
    this.getScheduleInfo();
  },
  methods: {
    async getScheduleInfo() {
      const scheduleInfo = (await getSchedule(this.scheduleId))["data"];
      this.scheduleTitle = scheduleInfo.title;
      this.scheduleLocation = scheduleInfo.location;
      this.scheduleDescription = scheduleInfo.description;
      this.scheduleIsVideoConferencing = scheduleInfo.isVideoConferencing;
    },
    async save() {
      const result = await editSchedule(
        this.scheduleId,
        this.scheduleTitle,
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

.container-background-color {
  background-color: rgb(247, 247, 247) !important;
}
</style>
