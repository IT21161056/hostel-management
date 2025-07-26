import { ApiError } from "../hooks/types";
import usePostRequest from "../hooks/usePostRequest";
import { CreateUserBody } from "./types";

export type TUseSignup = {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};
export const useSignup = ({ onSuccess, onError }: TUseSignup) =>
  usePostRequest<CreateUserBody>("/users", { onSuccess, onError });
