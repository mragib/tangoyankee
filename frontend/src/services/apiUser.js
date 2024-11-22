import { USER_PASSWORD_CHANGE } from "@/static";
import { addAndEdit } from "@/util";
import axios from "axios";

export async function getUser() {
  const res = await axios.get("auth-user");
  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function getUsers() {
  const res = await axios.get("users");

  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function signup({
  first_name,
  last_name,
  address,
  email,
  username,
  password,
  confirm_password,
  phone,
  role,
}) {
  // const res = await axios.post("signup", {
  //   first_name,
  //   last_name,
  //   address,
  //   email,
  //   password,
  //   username,
  //   confirm_password,
  //   phone,
  //   role,
  // });

  return addAndEdit({
    url: "signup",
    newData: {
      first_name,
      last_name,
      address,
      email,
      password,
      username,
      confirm_password,
      phone,
      role,
    },
  });
}

export async function login({ username, password }) {
  const { data } = await axios.post(
    "login",
    {
      username,
      password,
    },
    { withCredentials: true }
  );

  axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

  return data;
}

export async function logout() {
  const response = await axios.post("logout", {}, { withCredentials: true });

  axios.defaults.headers.common["Authorization"] = "";

  return response;
}

export async function forgotPassword({ email }) {
  const { data } = await axios.post("forget", { email });
  return data;
}

export async function reset(updatedPassword) {
  // const res = await axios.post(USER_PASSWORD_CHANGE, updatedPassword);
  // if (res.status !== 200) throw new Error("Something went wrong!🔥");
  // return res.data;

  return addAndEdit({ url: USER_PASSWORD_CHANGE, newData: updatedPassword });
}

export async function deleteUser(id) {
  const res = await axios.delete(`remove-user/${id}`);

  if (res.status !== 200) throw new Error("Something went wrong!🔥");
  return res.data;
}

export async function editUserProfile(newUserData) {
  const { image, first_name, last_name } = newUserData;

  // hasImagePath = true means old image / false means new image
  const hasImagePath = image?.startsWith?.("/uploads/profile-images");

  const imageName = hasImagePath
    ? hasImagePath
    : `${Math.trunc(
        Math.random() * 100000
      )}-${first_name}-${last_name}`.replaceAll(/[./\s]/g, "");
  // Create new filename
  let imagePath = image;
  try {
    if (!hasImagePath) {
      const fileExtension = image.name.split(".").pop(); // Get file extension
      const newFileName = hasImagePath
        ? hasImagePath
        : `${imageName}.${fileExtension}`;
      // Create a new File object with the new name
      const renamedFile = new File([image], newFileName, { type: image.type });

      const formData = new FormData();
      formData.append("file", renamedFile);
      const response = await axios.post(
        "users/upload-profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      imagePath = response.data.path;
    }

    // Once the image is uploaded, update the user's profile
    const res = await axios.patch("users/profile", {
      ...newUserData,
      image: imagePath, // Update profile with the new image path
    });

    return res.data;
  } catch (error) {
    console.error("Error uploading image:", error);
  }

  const res = await axios.patch("users/profile", newUserData);
  console.log(res);
}
