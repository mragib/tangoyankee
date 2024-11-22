import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <p>Loading</p>; // or a loading spinner
  }

  return children;
}

export default ProtectedRoutes;
