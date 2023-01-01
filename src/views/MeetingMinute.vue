<template>
  <v-container fluid fill-height class="container-background-color">
    <v-row class="d-flex justify-center">
      <v-col lg="10">
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="meetingMinutes"
              :search="search"
              fixed-header
              hide-default-footer
              hide-default-header
            >
              <template v-slot:top>
                <v-row class="d-flex justify-space-around">
                  <v-col class="pl-5">
                    <TableSearch
                      vTextLabel="Find a Meeting Minute..."
                      @ChangeInput="ChangeInput($event)"
                    />
                  </v-col>
                  <v-col class="d-flex justify-end align-end pr-5">
                    <NewItem
                      vCardTitle="Add Meeting Minute"
                      vTextLabel="Meeting Minute Title"
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
                <img src="../assets/meetingMinute.png">
                <a class="py-2 " @click="goToMeetingMinuteInfo(item.id)">
                  {{ item.title }}
                </a>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex justify-end align-end">
                  <v-icon @click="deleteMeetingMinute(item.id)"> mdi-delete </v-icon>
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
import { createMeetingMinute, deleteMeetingMinute, getMeetingMinutesInProject } from "@/apis/meetingMinute";

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
          text: "Meeting Minute Title",
          value: "title",
        },
        {
          text: "action",
          value: "action",
        },
      ],
      meetingMinutes: [{ type: Object, id: "", title: "", test: "" }],
      dialog: false,
      projectId: this.$route.params.projectId,
      msg: "",
      snackBar: false,
      snackBarTimeout: 5000,
      snackBarColor: "",
      dialogDelete: false,
      wantToDeleteMeetingMinuteId: -1,
    };
  },
  async created() {
    this.meetingMinutes = (await getMeetingMinutesInProject(this.projectId))["data"];
  },
  methods: {
    async goToMeetingMinuteInfo(id: any) {
      this.$router.push({ name: "MeetingMinuteInfo", params: { meetingMinuteId: id } });
    },
    async add(
      title: any,
    ) {
      const result = await createMeetingMinute(
        Number(this.projectId),
        title
      );
      this.msg = result["data"].message;
      this.dialog = false;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
      await this.getMeetingMinutes();
    },
    async showSnackBar(success: boolean ) {
      this.msg = success ? "Add success!" : "Add fail!";
      //this.dialog = false;
      this.snackBar = true;
      this.snackBarColor = success ? "green" : "red";
      await this.getMeetingMinutes();
    },
    async getMeetingMinutes() {
      this.meetingMinutes = (await getMeetingMinutesInProject(this.projectId))["data"];
    },
    ChangeInput(searchedMeetingMinute: any) {
      this.search = searchedMeetingMinute;
    },

    deleteMeetingMinute(meetingMinuteId: any) {
      this.dialogDelete = true;
      this.wantToDeleteMeetingMinuteId = meetingMinuteId;
    },

    async deleteConfirm() {
      const result = await deleteMeetingMinute(this.wantToDeleteMeetingMinuteId);
      this.dialogDelete = false;
      this.wantToDeleteMeetingMinuteId = -1;
      this.msg = result["data"].message;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
      await this.getMeetingMinutes();
    },

    deleteCancel() {
      this.dialogDelete = false;
      this.wantToDeleteMeetingMinuteId = -1;
    },
  },
});
</script>
<style></style>