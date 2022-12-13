import axios from "axios";
import { host } from "@/config/config";
import store from "@/store";

export const addSchedule = (projectName: string | null) => {
    return axios
      .post(
        `${host}/schedule/add`,
        {
          ProjectName: projectName
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${store.auth.getToken}`
          }
        }
      )
      .then(response => {
        return response;
      });
  };