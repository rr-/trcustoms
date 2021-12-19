import { fetchJSON, fetchMultipart } from "src/shared/client";
import { API_URL } from "src/shared/constants";
import { IGenericQuery } from "src/shared/types";
import { IPagedResponse } from "src/shared/types";
import { filterFalsyObjectValues } from "src/shared/utils";

interface IUserQuery extends IGenericQuery {}

interface IUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  has_picture: boolean;
  bio: string;
  date_joined: string;
  last_login: string;
  is_active: boolean;
}

interface IUserList extends IPagedResponse<IUser> {}

const getCurrentUser = async (): Promise<IUser | null> => {
  let data;
  try {
    data = await fetchJSON<IUser>(`${API_URL}/users/me/`, { method: "GET" });
  } catch (error) {
    data = null;
  }
  return data;
};

const getUserById = async (userId: number): Promise<IUser> => {
  let data;
  data = await fetchJSON<IUser>(`${API_URL}/users/${userId}/`, {
    method: "GET",
  });
  return data;
};

const getUserByUsername = async (username: string): Promise<IUser> => {
  let data;
  data = await fetchJSON<IUser>(`${API_URL}/users/by_username/${username}/`, {
    method: "GET",
  });
  return data;
};

const update = async (
  userId: number,
  {
    username,
    firstName,
    lastName,
    email,
    old_password,
    password,
    bio,
  }: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    old_password: string;
    password: string;
    bio: string;
  }
): Promise<IUser> => {
  const data: { [key: string]: any } = {
    username: username,
    first_name: firstName,
    last_name: lastName,
    email: email,
    bio: bio,
  };
  if (old_password) {
    data.old_password = old_password;
  }
  if (password) {
    data.password = password;
  }
  return await fetchJSON(`${API_URL}/users/${userId}/`, {
    method: "PATCH",
    data: data,
  });
};

const updatePicture = async (userId: number, file: File): Promise<null> => {
  const formData = new FormData();
  formData.append("picture", file);
  return await fetchMultipart(`${API_URL}/users/${userId}/picture/`, {
    method: "PATCH",
    data: formData,
  });
};

const register = async ({
  username,
  firstName,
  lastName,
  email,
  password,
  bio,
}: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio: string;
}): Promise<IUser> => {
  return await fetchJSON(`${API_URL}/users/`, {
    method: "POST",
    data: {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      bio: bio,
    },
  });
};

const getUsers = async (query: IUserQuery): Promise<IUserList | null> => {
  return await fetchJSON<IUserList>(`${API_URL}/users/`, {
    query: filterFalsyObjectValues({
      page: query.page ? `${query.page}` : null,
      sort: query.sort,
      search: query.search,
    }),
    method: "GET",
  });
};

const UserService = {
  register,
  update,
  updatePicture,
  getCurrentUser,
  getUserById,
  getUserByUsername,
  getUsers,
};

export type { IUser, IUserList, IUserQuery };
export { UserService };
