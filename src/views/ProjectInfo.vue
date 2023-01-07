<template>
  <v-container fill-height class="justify-center mt-10" style="width: 70%">
    <v-row>
      <v-col style="text-align: left">
        <v-edit-dialog @save="save" :return-value.sync="projectName">
          <div class="text-h3">{{ projectName }}</div>
          <template v-slot:input>
            <v-text-field
              v-model="projectName"
              label="Edit Name"
            ></v-text-field>
          </template> </v-edit-dialog
      ></v-col>
    </v-row>
    <v-row>
      <v-col v-if="isOwner" lg="1" class="d-flex align-begin pt-1">
        <InviteUser
          vCardTitle="Invite User"
          vTextLabel="User Name"
          @clickInvitation="clickInvatation($event)"
          :userInfo="userAccounts"
          @invite="send($event)"
        />
      </v-col>
      <v-col lg="1" class="d-flex align-begin pt-1">
        <ProjectMemberTable
          :projectOwnerId="projectOwnerId"
          :projectOwnerName="projectOwnerName"
          :projectId="projectId"
          :currentUserId="user.id"
          :tableData="projectMember"
          @deleteProjectMember="getProjectMemberWithoutOwner"
        />
      </v-col>
    </v-row>
      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab>Repository</v-tab>
        <v-tab>Schedule Survey</v-tab>
        <v-tab>Meeting Minute</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" class="tab-item">
        <v-tab-item
          ><Repository/></v-tab-item>
        <v-tab-item
          ><Schedule/></v-tab-item>
        <v-tab-item
          ><MeetingMinute/></v-tab-item>
      </v-tabs-items>
  </v-container>
</template>
  
<script lang="ts">
  import Vue from "vue";
  import Repository from "@/views/Repository.vue"
  import Schedule from "@/views/Schedule.vue"
  import { editProject, getProject, getProjectMember } from "@/apis/projects";
  import { getUserInfo, isCurrentUserProjectOwner } from "@/apis/user";
  import UserInfo from "@/components/UserInfo.vue";
  import InviteUser from "@/components/InviteUser.vue";
  import ProjectMemberTable from "@/components/ProjectMemberTable.vue";
  import { invite, sendInvitation } from "@/apis/notification";
import MeetingMinute from "./MeetingMinute.vue";
  
  export default Vue.extend({
    components: {
    Repository,
    Schedule,
    MeetingMinute,
    InviteUser,
    ProjectMemberTable
},
    data() {
      return {
        tab: null,
        user: { type: Object, id: "" },
        projectId: this.$route.params.projectId,
        projectName: "",
        projectOwnerId: "",
        projectOwnerName: "",
        projectMember: [{ type: Object, id: "", name: "", avatarUrl: "" }],
        isOwner: false,
        userAccounts: [],
        msg: "",
        dialog: false,
        snackBar: false,
        snackBarTimeout: 5000,
        snackBarColor: "",
        searchbarLength: 7,
      };
    },
    async created() {
    this.user = (await getUserInfo())["data"];
    this.isOwner = (await isCurrentUserProjectOwner(this.projectId))[
      "data"
    ].success;
    await this.getProjectInfo();
    await this.getProjectMemberWithoutOwner();
    if (!this.isOwner) this.searchbarLength = 10;
    },
    methods: {
    async getProjectMemberWithoutOwner() {
      const result = await getProjectMember(Number(this.projectId));
      this.projectMember = result["data"];
      this.projectMember = this.projectMember.filter(
        (item) => item.id != this.projectOwnerId
      );
    },
    async save() {
      const result = await editProject(
        Number(this.projectId),
        this.projectName
      );
      this.msg = result["data"].message;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
      await this.getProjectName();
    },
    async getProjectName() {
      this.projectName = (await getProject(Number(this.projectId)))[
        "data"
      ].name;
    },
    async getProjectInfo() {
      const result = (await getProject(Number(this.projectId)))["data"];

      this.projectOwnerId = result.ownerId;
      this.projectOwnerName = result.ownerName;
      this.projectName = result.name;
    },
    async send(applicantId: any) {
      const result = await sendInvitation(applicantId, Number(this.projectId));
      this.dialog = false;
      this.msg = result["data"].message;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
    },
    async clickInvatation(projectId: number) {
      invite(Number(this.projectId)).then((res) => {
        this.userAccounts = res.data;
      });
    },
  },
});
</script>

<style lang="scss">
.tab-item {
  width: 100%;
  height: 100%;
}
</style>
