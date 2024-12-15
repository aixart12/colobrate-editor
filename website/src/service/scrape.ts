import axiosInstance from "@/shared/axios";
import { SCRAPE_APIS } from "./api";

export const scrapeAndSave = async (payload: { url: string }) => {
  try {
    const response = await axiosInstance.post(
      SCRAPE_APIS.SCRAPE_AND_SAVE,
      payload
    );
    return response.data;
  } catch (e) {
    throw new Error("unable to scpape and save ");
  }
};

export const getScrapedData = async () => {
  try {
    const response = await axiosInstance.get(SCRAPE_APIS.GET_SCRAPED_DATA);
    return response.data;
  } catch (e) {
    throw new Error("unable to get scrape data ");
  }
};

export const getScrapedDataByID = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      SCRAPE_APIS.GET_SCRAPED_DATA_BY_ID(id)
    );
    return response.data;
  } catch (e) {
    throw new Error("unable to get scrape data by Id ");
  }
};

export const updateScrapedDataByID = async (
  id: number,
  payload: {
    content: string;
  }
) => {
  try {
    const response = await axiosInstance.put(
      SCRAPE_APIS.GET_SCRAPED_DATA_BY_ID(id),
      payload
    );
    return response.data;
  } catch (e) {
    throw new Error("unable to update scrape data by Id ");
  }
};
