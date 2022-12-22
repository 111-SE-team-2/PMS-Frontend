<template>
  <v-container fluid fill-height class="container-background-color">
    <v-row class="d-flex justify-center">
      <v-col lg="10">
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="schedules"
              :search="search"
              fixed-header
              hide-default-footer
              hide-default-header
            >
              <template v-slot:top>
                <v-row class="d-flex justify-space-around">
                  <v-col class="pl-5">
                    <TableSearch
                      vTextLabel="Find a Schedule..."
                      @ChangeInput="ChangeInput($event)"
                    />
                  </v-col>
                  <v-col class="d-flex justify-end align-end pr-5">
                    <NewItem
                      vCardTitle="Add Schedule"
                      vTextLabel="Schedule Title"
                      @add="add"
                      @showSnackBar="showSnackBar"
                    />
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-dialog v-model="dialogDelete" max-width="30%">
                  <v-card>
                    <v-card-title class="headline"
                      >Are you sure you want to delete?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="deleteCancel()"
                        >Cancel</v-btn
                      >
                      <v-btn color="blue darken-1" text @click="deleteConfirm()"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:[`item.title`]="{ item }">
                <img src="../assets/schedule.png">
                <a class="py-2 " @click="goToScheduleInfo(item.id)">
                  {{ item.title }}
                </a>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex justify-end align-end">
                  <v-icon @click="deleteSchedule(item.id)"> mdi-delete </v-icon>
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
      <v-snackbar
        v-model="snackBar"
        :timeout="snackBarTimeout"
        :color="snackBarColor"
      >
        {{ msg }}
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import router from "@/router";
import NewItem from "@/components/NewItem.vue";
import TableSearch from "@/components/TableSearch.vue";
import { createSchedule, deleteSchedule, getSchedulesInProject } from "@/apis/schedule";

export default Vue.extend({
  components: {
    NewItem,
    TableSearch,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "ScheduleTitle",
          value: "title",
        },
        {
          text: "action",
          value: "action",
        },
      ],
      schedules: [{ type: Object, id: "", title: "", test: "" }],
      dialog: false,
      projectId: this.$route.params.projectId,
      msg: "",
      snackBar: false,
      snackBarTimeout: 5000,
      snackBarColor: "",
      dialogDelete: false,
      wantToDeleteScheduleId: -1,
    };
  },
  async created() {
    this.schedules = (await getSchedulesInProject(this.projectId))["data"];
  },
  methods: {
    async goToScheduleInfo(id: any) {
      this.$router.push({ name: "ScheduleInfo", params: { scheduleId: id } });
    },
    async add(
      title: any,
      location: string,
      description: string,
      isVideoConferencing: boolean
    ) {
      const result = await createSchedule(
        Number(this.projectId),
        title,
        location,
        description,
        isVideoConferencing
      );
      this.msg = result["data"].message;
      this.dialog = false;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
      await this.getSchedules();
    },
    async showSnackBar(success: boolean ) {
      this.msg = success ? "Add success!" : "Add fail!";
      //this.dialog = false;
      this.snackBar = true;
      this.snackBarColor = success ? "green" : "red";
      await this.getSchedules();
    },
    async getSchedules() {
      this.schedules = (await getSchedulesInProject(this.projectId))["data"];
    },
    ChangeInput(searchedSchedule: any) {
      this.search = searchedSchedule;
    },

    deleteSchedule(scheduleId: any) {
      this.dialogDelete = true;
      this.wantToDeleteScheduleId = scheduleId;
    },

    async deleteConfirm() {
      const result = await deleteSchedule(this.wantToDeleteScheduleId);
      this.dialogDelete = false;
      this.wantToDeleteScheduleId = -1;
      this.msg = result["data"].message;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
      await this.getSchedules();
    },

    deleteCancel() {
      this.dialogDelete = false;
      this.wantToDeleteScheduleId = -1;
    },
  },
});
</script>
<style></style>
