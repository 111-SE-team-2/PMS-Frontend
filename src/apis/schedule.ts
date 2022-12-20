import axios from "axios";
import { host } from "@/config/config";
import store from "@/store";

export const getSchedulesInProject: any = (projectId: string) => {
  return axios.get(`${host}/schedule/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const createSchedule: any = (
  projectId: number,
  name: string,
  location: string,
  description: string,
  isVideoConferencing: boolean
) => {
  return axios.post(
    `${host}/schedule/create`,
    {
      projectId: projectId,
      name: name,
      location: location,
      description: description,
      isVideoConferencing: isVideoConferencing
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const deleteSchedule: any = (scheduleId: number) => {
  return axios.delete(`${host}/schedule/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const getSchedule: any = (scheduleId: string) => {
  return axios.get(`${host}/schedule/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const editSchedule: any = (
  scheduleId: number,
  name: string,
  location: string,
  description: string,
  isVideoConferencing: boolean
) => {
  return axios.put(
    `${host}/schedule/edit`,
    {
      scheduleId: scheduleId,
      name: name,
      location: location,
      description: description,
      isVideoConferencing: isVideoConferencing
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const getScheduleOptions: any = (scheduleId: string) => {
  return axios.get(`${host}/scheduleOption/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};
