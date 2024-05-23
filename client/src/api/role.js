import { axiosSecure } from "../hooks/useAxiosSecure";

export const getRole = async (email) => {
  const { data } = await axiosSecure.get(`/user/${email}`);
  return data.role;
};
