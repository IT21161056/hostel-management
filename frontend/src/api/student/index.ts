import useGetRequest from "../hooks/useGetRequest";
import usePostRequest from "../hooks/usePostRequest";
import {
  CreateStudentBody,
  GetAllStudentsPaginated,
  TUseCreateUser,
} from "./types";

export const useCreateStudent = ({ onSuccess, onError }: TUseCreateUser) =>
  usePostRequest<CreateStudentBody>(`/student`, { onSuccess, onError });

export const useGetAllStudents = (params?: Record<string, any>) =>
  useGetRequest<GetAllStudentsPaginated>(`/student`, params);
