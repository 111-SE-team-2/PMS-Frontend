<template>
  <v-container fluid fill-height class="container-background-color">
    <v-row class="d-flex justify-center">
      <v-col lg="10">
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="repositories"
              :search="search"
              fixed-header
              hide-default-footer
              hide-default-header
            >
              <template v-slot:top>
                <v-row class="d-flex justify-space-around">
                  <v-col class="pl-5">
                    <TableSearch
                      vTextLabel="Find a Repo..."
                      @ChangeInput="ChangeInput($event)"
                    />
                  </v-col>
                  <v-col class="d-flex justify-end align-end pr-5">
                    <NewItem
                      vCardTitle="Add Repository"
                      vTextLabel="Repository URL"
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
              <template v-slot:[`item.name`]="{ item }">
                <img src="../assets/GitHub-Mark-32px.png">
                <a class="py-2 " @click="goToRepoInfo(item.id, item.type)">
                  {{ item.name }}
                </a>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex justify-end align-end">
                  <v-icon @click="deleteRepo(item.id)"> mdi-delete </v-icon>
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
import { addRepo, getRepository, deleteRepo } from "@/apis/repository";
import NewItem from "@/components/NewItem.vue";
import TableSearch from "@/components/TableSearch.vue";

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
          text: "RepositoryName",
          value: "name",
        },
        {
          text: "action",
          value: "action",
        },
      ],
      repositories: [{ type: Object, id: "", name: "", test: "" }],
      dialog: false,
      projectId: this.$route.params.projectId,
      url: "",
      msg: "",
      snackBar: false,
      snackBarTimeout: 5000,
      snackBarColor: "",
      dialogDelete: false,
      wantToDeleteRepoId: -1,
    };
  },
  async created() {
    this.repositories = (await getRepository(this.projectId))["data"];
  },
  methods: {
    async goToRepoInfo(id: any, type: any) {
      if(type === "Jira") {
        this.$router.push({ name: "JiraInfo", params: { repoId: id } });
      } else {
        this.$router.push({ name: "RepoInfo", params: { repoId: id } });
      }
    },
    async add(
      url: any,
      isSonarqube: boolean,
      sonarqubeUrl: string,
      accountColonPassword: string,
      projectKey: string
    ) {
      const result = await addRepo(
        Number(this.projectId),
        url,
        isSonarqube,
        sonarqubeUrl,
        accountColonPassword,
        projectKey
      );
      this.msg = result["data"].message;
      this.dialog = false;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
      await this.getResitories();
    },
    async showSnackBar(success: boolean ) {
      this.msg = success ? "Add success!" : "Add fail!";
      //this.dialog = false;
      this.snackBar = true;
      this.snackBarColor = success ? "green" : "red";
      await this.getResitories();
    },
    async getResitories() {
      this.repositories = (await getRepository(this.projectId))["data"];
    },
    ChangeInput(searchedRepo: any) {
      this.search = searchedRepo;
    },

    deleteRepo(repoId: any) {
      this.dialogDelete = true;
      this.wantToDeleteRepoId = repoId;
    },

    async deleteConfirm() {
      const result = await deleteRepo(this.projectId, this.wantToDeleteRepoId);
      this.dialogDelete = false;
      this.wantToDeleteRepoId = -1;
      this.msg = result["data"].message;
      this.snackBar = true;
      this.snackBarColor = result["data"].success ? "green" : "red";
      await this.getResitories();
    },

    deleteCancel() {
      this.dialogDelete = false;
      this.wantToDeleteRepoId = -1;
    },
  },
});
</script>
<style></style>
