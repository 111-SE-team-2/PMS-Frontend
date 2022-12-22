<template>
	<v-container fluid style="height: 100%" class="container-background-color">
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
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div class="d-flex justify-end align-end">
              <v-icon @click="deleteScheduleOption(item.scheduleOptionId)"> mdi-delete </v-icon>
            </div>
          </template>
        </v-data-table>
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
  import NewItem from "@/components/NewItem.vue";
	import { addScheduleOption, deleteScheduleOption, getScheduleOptions, getUserListInScheduleOption } from "@/apis/schedule";
import { VContainer, VRow, VCol, VDataTable, VDivider, VDialog, VCard, VCardTitle, VCardActions, VSpacer, VBtn, VIcon, VSnackbar } from "vuetify/lib";

	export default Vue.extend({
		components: {
      NewItem,
		},
		data() {
			return {
				scheduleId: Number(this.$route.params.scheduleId),
				scheduleOptions: [],
				userScheduleOptions: [],
				msg: "",
				dialog: false,
				snackBar: false,
				snackBarTimeout: 5000,
				snackBarColor: "",
				headers: [
					{text: "StartTime", value: "startTime"},
			    {text: "Duration", value: "duration"},
					{text: "Yes", value: "numberOfYes"},
					{text: "IfNeedBe", value: "numberOfIfNeedBe"},
					{text: "CannotAttend", value: "numberOfCannotAttend"},
					{text: "Pending", value: "numberOfPending"},
					{text: "MySelection", value: ""},
          {text: "action", value: "action"},
				],
        dialogDelete: false,
        wantToDeleteScheduleOptionId: -1,
			};
		},
		async created() {
			this.scheduleOptions = (await getScheduleOptions(this.scheduleId))["data"];
		},
		methods: {
      async getScheduleOptions() {
        this.scheduleOptions = (await getScheduleOptions(this.scheduleId))["data"];
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
      async showSnackBar(success: boolean ) {
        this.msg = success ? "Add success!" : "Add fail!";
        //this.dialog = false;
        this.snackBar = true;
        this.snackBarColor = success ? "green" : "red";
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
