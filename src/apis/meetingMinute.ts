import axios from "axios";
import { host } from "@/config/config";
import store from "@/store";

export const getMeetingMinutesInProject: any = (projectId: string) => {
  return axios.get(`${host}/meetingMinute/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const createMeetingMinute: any = (
  projectId: number,
  title: string
) => {
  return axios.post(
    `${host}/meetingMinute/create`,
    {
      projectId: projectId,
      title: title
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const deleteMeetingMinute: any = (meetingMinuteId: number) => {
  return axios.delete(`${host}/meetingMinute/${meetingMinuteId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const getMeetingMinute: any = (meetingMinuteId: string) => {
  return axios.get(`${host}/meetingMinute/${meetingMinuteId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const editMeetingMinute: any = (
  meetingMinuteId: number,
  title: string,
  content: string
) => {
  return axios.put(
    `${host}/meetingMinute/edit`,
    {
      meetingMinuteId: meetingMinuteId,
      title: title,
      content: content
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};
