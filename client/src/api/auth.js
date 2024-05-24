//  get all the user
import { axiosSecure } from "../hooks/useAxiosSecure";

export const getAllUsers = async () => {
  const { data } = await axiosSecure.get("/users");
  return data;
};
