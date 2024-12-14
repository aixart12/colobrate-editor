import axiosInstance from "@/shared/axios";
import { AUTH_APIS } from "./api";

export const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(AUTH_APIS.SIGN_UP, payload);
    return response.data;
  } catch (e) {
    throw new Error("unable to create user");
  }
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<{ token: string }> => {
  try {
    const response = await axiosInstance.post(AUTH_APIS.LOGIN, payload);
    return response.data;
  } catch (e) {
    throw new Error("unable to login");
  }
};
