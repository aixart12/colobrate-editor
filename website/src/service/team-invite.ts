import axiosInstance from "@/shared/axios";
import { INVITE_APIS } from "./api";

export const inviteTeamMember = async (payload: { email: string }) => {
  try {
    const response = await axiosInstance.post(INVITE_APIS.INVITE, payload);
    return response.data;
  } catch (e) {
    throw new Error("unable to create user");
  }
};

export const accpetInvite = async (payload: {
  token: string;
  name: string;
}) => {
  try {
    const response = await axiosInstance.post(
      INVITE_APIS.ACCEPT_INVITE,
      payload
    );
    return response.data;
  } catch (e) {
    throw new Error("unable to create user");
  }
};
