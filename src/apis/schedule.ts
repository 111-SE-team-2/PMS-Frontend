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

export const getSchedule: any = (scheduleId: string) => {
  return axios.get(`${host}/schedule/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const editSchedule: any = (
  scheduleId: number,
  title: string,
  location: string,
  description: string,
  isVideoConferencing: boolean
) => {
  return axios.put(
    `${host}/schedule/edit`,
    {
      scheduleId: scheduleId,
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

export const getScheduleOptions: any = (scheduleId: string) => {
  return axios.get(`${host}/scheduleOption/${scheduleId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const addScheduleOption: any = (
  scheduleId: number,
  startTime: string,
  duration: string,
) => {
  return axios.post(
    `${host}/scheduleOption/add`,
    {
      scheduleId: scheduleId,
      startTime: startTime,
      duration: duration,
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const deleteScheduleOption: any = (scheduleOptionId: string) => {
  return axios.delete(`${host}/scheduleOption/${scheduleOptionId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const voteScheduleOption: any = (
  scheduleOptionId: number,
  availability: string
) => {
  return axios.post(
    `${host}/userScheduleOption/vote`,
    {
      scheduleOptionId: scheduleOptionId,
      availability: availability,
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const getUserListInScheduleOption: any = (scheduleOptionId: string) => {
  return axios.get(`${host}/userScheduleOption/${scheduleOptionId}/list`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};
