import axios from "axios"
import { getToken } from "./auth"

const instance = axios.create({
  baseURL: "/",
  // timeout: 5000
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    // 'Authorization': localStorage.getItem("admin-token") || "",
  },
  withCredentials: false,
})

instance.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (getToken()) {
      config.headers!.Authorization = `${getToken()}` as string
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log("Error: " + error.message) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
instance.interceptors.response.use(
  (response) => {
    const resp = response.data
    if(resp.code === 200) {
      return resp.data
    }
    // if (resp.code === 401) {
    //   notify.error(resp.message);
    //   bus.emit(
    //     "to",
    //     `/@login?redirect=${encodeURIComponent(window.location.pathname)}`
    //   );
    // }
    return resp
  },
  (error) => {
    // response error
    console.error(error) // for debug
    // notificationService.show({
    //   status: "danger",
    //   title: error.code,
    //   description: error.message,
    // });
    return {
      code: error.response.status,
      message: error.message,
    }
  }
)
export default instance
