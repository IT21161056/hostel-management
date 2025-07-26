import useGetRequest from "../hooks/useGetRequest";
import { GetAllUsersPaginated } from "./types";

export const useGetAllUsers = () =>
  useGetRequest<GetAllUsersPaginated>(`/users`);
