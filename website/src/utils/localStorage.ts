"use client";
const ACCESS_TOKEN = "access_token";

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const hasToken = (): boolean => {
  const AT = localStorage.getItem(ACCESS_TOKEN);
  return AT ? true : false;
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN);
};

export const setAccessToken = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
};
