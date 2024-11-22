import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import logo from "../../assets/logo-icon.svg";

import { useSelector } from "react-redux";
import AdminSideBar from "./AdminSideBar";
import OwnerSideBar from "./OwnerSideBar";
import ManagerSideBar from "./ManagerSideBar";
import SalesManSideBar from "./SalesManSideBar";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const role = user.role.name;

  if (role === "admin")
    return (
      <AdminSideBar
        logo={logo}
        pathname={pathname}
        setSidebarExpanded={setSidebarExpanded}
        setSidebarOpen={setSidebarOpen}
        sidebar={sidebar}
        trigger={trigger}
        sidebarExpanded={sidebarExpanded}
        sidebarOpen={sidebarOpen}
      />
    );

  if (role === "owner")
    return (
      <OwnerSideBar
        logo={logo}
        pathname={pathname}
        setSidebarExpanded={setSidebarExpanded}
        setSidebarOpen={setSidebarOpen}
        sidebar={sidebar}
        trigger={trigger}
        sidebarExpanded={sidebarExpanded}
        sidebarOpen={sidebarOpen}
      />
    );
  if (role === "manager")
    return (
      <ManagerSideBar
        logo={logo}
        pathname={pathname}
        setSidebarExpanded={setSidebarExpanded}
        setSidebarOpen={setSidebarOpen}
        sidebar={sidebar}
        trigger={trigger}
        sidebarExpanded={sidebarExpanded}
        sidebarOpen={sidebarOpen}
      />
    );

  if (role === "sales")
    return (
      <SalesManSideBar
        logo={logo}
        pathname={pathname}
        setSidebarExpanded={setSidebarExpanded}
        setSidebarOpen={setSidebarOpen}
        sidebar={sidebar}
        trigger={trigger}
        sidebarExpanded={sidebarExpanded}
        sidebarOpen={sidebarOpen}
      />
    );
};

export default Sidebar;
