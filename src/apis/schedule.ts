import axios from "axios";
import { host } from "@/config/config";
import store from "@/store";

export const getSchedule = (projectId: string) => {
  return axios.get(`${host}/schedule/${projectId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const createSchedule: any = (
  projectId: number,
  title: string,
  location: string,
  description: string,
  isVideoConferencing: boolean
) => {
  return axios.post(
    `${host}/schedule/create`,
    {
      projectId: projectId,
      title: title,
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
