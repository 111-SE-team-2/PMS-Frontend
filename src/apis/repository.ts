import axios from "axios";
import { host } from "../config/config";
import store from "@/store";

export const getRepository = (projectId: string) => {
  return axios.get(`${host}/repo/${projectId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const addRepo: any = (
  projectId: number,
  url: string,
  isSonarqube: boolean,
  sonarqubeUrl: string,
  accountColonPassword: string,
  projectKey: string
) => {
  return axios.post(
    `${host}/repo`,
    {
      projectId: projectId,
      url: url,
      isSonarqube: isSonarqube,
      sonarqubeUrl: sonarqubeUrl,
      accountColonPassword: accountColonPassword,
      projectKey: projectKey
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const getJiraBoardInfo: any = (
  DomainURL: string,
  APIToken: string,
  Account: string,
  BoardId: number,
  ProjectId: number
) => {
  return axios.post(
    `${host}/jira/boardInfo`,
    {
      DomainURL: DomainURL,
      APIToken: APIToken,
      Account: Account,
      BoardId: BoardId,
      ProjectId: ProjectId
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const createJiraRepo: any = (
  DomainURL: string,
  APIToken: string,
  Account: string,
  BoardId: number,
  ProjectId: number
) => {
  return axios.post(
    `${host}/jira/createRepo`,
    {
      DomainURL: DomainURL,
      APIToken: APIToken,
      Account: Account,
      BoardId: BoardId,
      ProjectId: ProjectId
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const deleteRepo: any = (projectId: number, repoId: number) => {
  return axios.delete(`${host}/repo/${projectId}/${repoId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

