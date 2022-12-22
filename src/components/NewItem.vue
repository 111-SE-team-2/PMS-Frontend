<template>
  <v-dialog v-model="dialog" max-width="60%">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" v-bind="attrs" v-on="on" @click="clearInputData"
        ><v-icon>mdi-plus-box-multiple-outline</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ vCardTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-select
                label="Select repository type"
                :items="['Github', 'Gitlab', 'Sonarqube', 'Jira']"
                v-model="repoType"
                v-show="isProject() && isSchedule()"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <!-- add project form-->
        <v-container v-show="!isProject()">
          <v-row>
            <v-col cols="12">
              <v-text-field
                :label="vTextLabel"
                v-model="url"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="add"> Add </v-btn>
          </v-row>
        </v-container>
        <!-- add schedule form-->
        <v-container v-show="!isSchedule() && isScheduleOption()">
          <v-row>
            <v-col cols="12">
              <v-text-field
                :label="vTextLabel"
                v-model="title"
                required
              ></v-text-field>
              <v-text-field
                label="location"
                v-model="location"
                required
              ></v-text-field>
              <v-text-field
                label="description"
                v-model="description"
                required
              ></v-text-field>
              <v-switch
                label="isVideoConferencing"
                v-model="isVideoConferencing"
                required
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="addSchedule"> Add </v-btn>
          </v-row>
        </v-container>
        <!-- add schedule option form-->
        <v-container v-show="!isScheduleOption()">
          <v-row>
            <v-col cols="12">
              <v-text-field
                :label="vTextLabel"
                v-model="startTime"
                required
              ></v-text-field>
              <v-text-field
                label="duration"
                v-model="duration"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="addScheduleOption"> Add </v-btn>
          </v-row>
        </v-container>
        <!-- github form -->
        <v-form v-show="repoType === 'Github'">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :label="repoType + ' ' + vTextLabel"
                  v-model="url"
                  required
                  v-show="repoType !== ''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="add"> Add </v-btn>
            </v-row>
          </v-container>
        </v-form>
        <!-- gitlab form -->
        <v-form v-show="repoType === 'Gitlab'">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :label="repoType + ' ' + vTextLabel"
                  v-model="url"
                  required
                  v-show="repoType !== ''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="add"> Add </v-btn>
            </v-row>
          </v-container>
        </v-form>
        <!-- Jira Form -->
        <v-form v-show="repoType === 'Jira'">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :label="repoType + ' ' + vTextLabel"
                  v-model="jiraData.URL"
                  required
                  v-show="repoType !== ''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field label="Account" v-model="jiraData.account"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="API token" v-model="jiraData.token"></v-text-field>
              </v-col>
              <v-col width="50%">
                <v-btn color="primary" @click="verifyAndGetBoardInfo">
                  Verified
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  label="Select board"
                  :items="jiraData.boardList"
                  item-text="name"
                  item-value="id"
                  v-model="jiraData.selectBoardId"
                  v-show="jiraVerifyState"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="addJiraRepo"> Add </v-btn>
            </v-row>
          </v-container>
        </v-form>
        <!-- Sonarqube Form -->
        <v-form v-show="repoType === 'Sonarqube'">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Sonarqube URL"
                  v-model="sonarqubeUrl"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field label="Account" v-model="sonarqubeAccount"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Password"
                  v-model="sonarqubePassword"
                  type="password"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="ProjectKey"
                  v-model="projectKey"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="add"> Add </v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import router from "@/router";
import { getJiraBoardInfo, createJiraRepo } from "@/apis/repository";
export default Vue.extend({
  props: ["vCardTitle", "vTextLabel"],
  data() {
    return {
      jiraData:{
        account: "",
        token: "",
        selectBoardId: null,
        URL:"",
        boardList: []
      },
      isSonarqube: false,
      url: "",
      sonarqubeUrl: "",
      sonarqubeAccount: "",
      sonarqubePassword: "",
      projectKey: "",
      dialog: false,
      userAccounts: [] as any,
      repoType: "",
      jiraVerifyState: false,
      projectId: this.$route.params.projectId,
      title: "",
      location: "",
      description: "",
      isVideoConferencing: false,
      startTime: "",
      duration: ""
    };
  },
  watch: {
    isSonarqube: function () {
      this.sonarqubeUrl = "";
      this.sonarqubeAccount = "";
      this.sonarqubePassword = "";
      this.projectKey = "";
    },
  },
  methods: {
    add() {
      const accountColonPassword = btoa(this.sonarqubeAccount + ":" + this.sonarqubePassword);
      this.$emit(
        "add",
        this.url,
        this.isSonarqube,
        this.sonarqubeUrl,
        accountColonPassword,
        this.projectKey
      );
      this.dialog = false;
    },
    clearInputData() {
      this.url = "";
      this.sonarqubeUrl = "";
      this.sonarqubeAccount = "";
      this.sonarqubePassword = "";
      this.projectKey = "";
      this.isSonarqube = false;
      this.repoType = "";
      this.jiraData.account = "";
      this.jiraData.token = "";
      this.jiraData.selectBoardId = null;
      this.jiraData.URL = "";
      this.jiraData.boardList = [];
      this.jiraVerifyState = false;
      this.title = "";
      this.location = "";
      this.description = "";
      this.isVideoConferencing = false;
      this.startTime = "";
      this.duration = "";
    },
    isProject() {
      return !this.vCardTitle.includes("Project");
    },
    isSchedule() {
      return !this.vCardTitle.includes("Schedule");
    },
    isScheduleOption() {
      return !this.vCardTitle.includes("Schedule Option");
    },
    async verifyAndGetBoardInfo() { 
      const result = await getJiraBoardInfo(
        this.jiraData.URL,
        this.jiraData.token,
        this.jiraData.account,
        undefined,
        undefined
      );
      if (result.data.success) {
        this.jiraVerifyState = true;
        this.jiraData.boardList = result.data.data;
      } else {
        this.jiraVerifyState = false;
        this.jiraData.boardList = [];
        this.jiraData.selectBoardId = null;
      }
    },
    async addJiraRepo(){
      const result = await createJiraRepo(
        this.jiraData.URL,
        this.jiraData.token,
        this.jiraData.account,
        this.jiraData.selectBoardId,
        this.projectId
      );
      this.$emit(
        "showSnackBar",
        result.data.success
      );
      this.dialog = false;
    },
    addSchedule(){
      this.$emit(
        "add",
        this.title,
        this.location,
        this.description,
        this.isVideoConferencing
      );
      this.dialog = false;
    },
    addScheduleOption(){
      this.$emit(
        "add",
        this.startTime,
        this.duration
      );
      this.dialog = false;
    }
  },
});
</script>
