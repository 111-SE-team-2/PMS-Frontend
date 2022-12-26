<template>
	<v-container fluid class="container-background-color">
	  <v-row class="d-flex justify-center">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="scheduleOptions"
          fixed-header
          hide-default-footer
        >
          <template v-slot:top>
            <v-row class="d-flex justify-space-around">
              <v-col class="d-flex justify-end align-end pr-5">
                <NewItem
                  vCardTitle="Add Schedule Option"
                  vTextLabel="schedule option time"
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
            <v-dialog v-model="dialogVote" max-width="30%">
              <v-card>
                <v-card-title class="headline"
                  >Please select your availability</v-card-title
                >
                <v-card-subtitle>This is your availability now: 
                  <v-chip
                    class="py-3 my-4 status"
                    :color="getColor(availabilityMap.get(wantToVoteScheduleOptionId))"
                    label
                    x-small
                    dark
                  >{{ availabilityMap.get(wantToVoteScheduleOptionId) }}</v-chip>
                </v-card-subtitle>
                <v-card-text>
                  <v-select
                  label="Select availability"
                  :items="['Yes', 'If Need Be', 'Cannot Attend', 'Pending']"
                  v-model="availabilitySelection"
                ></v-select>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="voteCancel()"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="voteConfirm()"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-icon @click="deleteScheduleOption(item.id)"> mdi-delete </v-icon>
          </template>
          <template v-slot:[`item.id`]="{ item }">
            <v-chip
              class="py-3 my-4 status"
              :color="getColor(availabilityMap.get(item.id))"
              label
              x-small
              dark
              @click="voteScheduleOption(item.id)"
            >{{ availabilityMap.get(item.id) }}</v-chip>
          </template>
        </v-data-table>
			</v-col>
      <v-snackbar
        v-model="snackBar"
        :timeout="snackBarTimeout"
        :color="snackBarColor"
      >{{ msg }}</v-snackbar>
		</v-row>
	</v-container>
</template>
  
<script lang="ts">
	import Vue from "vue";
  import NewItem from "@/components/NewItem.vue";
	import { addScheduleOption, deleteScheduleOption, getScheduleOptions, voteScheduleOption } from "@/apis/schedule";
import { getUserInfo } from "@/apis/user";

	export default Vue.extend({
		components: {
      NewItem,
		},
		data() {
			return {
        
				scheduleId: Number(this.$route.params.scheduleId),
				scheduleOptions: [{ type: Object, id: "", users: [{type: Object, account: "", availability: ""}]}],
				msg: "",
				dialog: false,
				snackBar: false,
				snackBarTimeout: 5000,
				snackBarColor: "",
				headers: [
					{text: "StartTime", value: "startTime"},
			    {text: "Duration", value: "duration"},
					{text: "Yes", value: "numberOfYes"},
					{text: "If Need Be", value: "numberOfIfNeedBe"},
					{text: "Cannot Attend", value: "numberOfCannotAttend"},
					{text: "Pending", value: "numberOfPending"},
					{text: "My Availability", value: "id"},
          {text: "Action", value: "action"},
				],
        dialogDelete: false,
        wantToDeleteScheduleOptionId: -1,
        availabilityMap: new Map(),
        user: { type: Object, id: "" },
        dialogVote: false,
        wantToVoteScheduleOptionId: -1,
        availabilitySelection: "Unselect"
			};
		},
		async created() {
      this.user = (await getUserInfo())["data"];
			this.scheduleOptions = (await getScheduleOptions(this.scheduleId))["data"];
      this.scheduleOptions.forEach((value) => {
        this.availabilityMap.set(value.id, "Unselect");
        value.users.forEach((user) => {
          if (user.account === this.user.id) {
            this.availabilityMap.set(value.id, user.availability);
          }
        })
      });
		},
		methods: {
      async getScheduleOptions() {
        this.scheduleOptions = (await getScheduleOptions(this.scheduleId))["data"];
        this.scheduleOptions.forEach((value) => {
          this.availabilityMap.set(value.id, "Unselect");
          value.users.forEach((user) => {
            if (user.account === this.user.id) {
              this.availabilityMap.set(value.id, user.availability);
            }
          })
        });
      },
      async add(
        startTime: string,
        duration: string
      ) {
        const result = await addScheduleOption(
          this.scheduleId,
          startTime,
          duration,
        );
        this.msg = result["data"].message;
        this.dialog = false;
        this.snackBar = true;
        this.snackBarColor = result["data"].success ? "green" : "red";
        await this.getScheduleOptions();
      },
      deleteScheduleOption(scheduleOptionId: any) {
        this.dialogDelete = true;
        this.wantToDeleteScheduleOptionId = scheduleOptionId;
      },
      async deleteConfirm() {
        const result = await deleteScheduleOption(this.wantToDeleteScheduleOptionId);
        this.dialogDelete = false;
        this.wantToDeleteScheduleOptionId = -1;
        this.msg = result["data"].message;
        this.snackBar = true;
        this.snackBarColor = result["data"].success ? "green" : "red";
        await this.getScheduleOptions();
      },
      deleteCancel() {
        this.dialogDelete = false;
        this.wantToDeleteScheduleOptionId = -1;
      },
      voteScheduleOption(scheduleOptionId: any) {
        this.dialogVote = true;
        this.wantToVoteScheduleOptionId = scheduleOptionId;
        this.availabilitySelection = this.availabilityMap.get(scheduleOptionId);
      },
      async voteConfirm() {
        const result = await voteScheduleOption(this.wantToVoteScheduleOptionId, this.availabilitySelection);
        this.dialogVote = false;
        this.wantToVoteScheduleOptionId = -1;
        this.availabilitySelection = "Unselect";
        this.msg = result["data"].message;
        this.snackBar = true;
        this.snackBarColor = result["data"].success ? "green" : "red";
        await this.getScheduleOptions();
      },
      voteCancel() {
        this.dialogVote = false;
        this.wantToVoteScheduleOptionId = -1;
        this.availabilitySelection = "Unselect";
      },
      getColor(type: string) {
        if (type === "Yes") return "green";
        else if (type === "If Need Be") return "orange";
        else if (type === "Cannot Attend") return "red";
        else if (type === "Pending") return "gray";
        else return "black";
      },
      async showSnackBar(success: boolean ) {
        this.msg = success ? "Add success!" : "Add fail!";
        //this.dialog = false;
        this.snackBar = true;
        this.snackBarColor = success ? "green" : "red";
        await this.getScheduleOptions();
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
