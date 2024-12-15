export const AUTH_APIS = {
  LOGIN: "/login",
  SIGN_UP: "/signup",
};

export const INVITE_APIS = {
  INVITE: "/invite",
  ACCEPT_INVITE: "/accept-invite",
};

export const SCRAPE_APIS = {
  SCRAPE_AND_SAVE: "/scrape/save",
  GET_SCRAPED_DATA: "/scrape/get",
  GET_SCRAPED_DATA_BY_ID: (id: number) => `/scraped-data/${id}`,
  UPDATE_SCRAPED_DATA_BY_ID: (id: number) => `/scraped-data/${id}`,
};
