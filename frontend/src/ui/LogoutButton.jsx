import { logoutUser } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
