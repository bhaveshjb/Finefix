import { SessionProvider } from "@/context/SessionContext";
import PrivateWrapper from "@/components/PrivateWrapper";
import Layout from "./Layout.jsx";
import Landing from "./Landing";
import Appeal from "./Appeal";
import Blog from "./Blog";
import AppealFeedback from "./AppealFeedback";
import UserDashboard from "./UserDashboard";
import UserProfile from "./UserProfile";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Success from "./Success.jsx";
import Login from "./Login.jsx";

const PAGES = {
  Landing: Landing,

  Appeal: Appeal,

  Blog: Blog,

  AppealFeedback: AppealFeedback,

  UserDashboard: UserDashboard,

  UserProfile: UserProfile,
};

function _getCurrentPage(url) {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split("/").pop();
  if (urlLastPart.includes("?")) {
    urlLastPart = urlLastPart.split("?")[0];
  }

  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <SessionProvider>
      <Layout currentPageName={currentPage}>
        <Routes>
          <Route element={<PrivateWrapper fallbackRoute="/login" />}>
            <Route path="/UserDashboard" element={<UserDashboard />} />
            <Route path="/UserProfile" element={<UserProfile />} />
          </Route>
          <Route path="/" element={<Landing />} />
          <Route path="/Landing" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Appeal" element={<Appeal />} />
          <Route path="/Appeal/Success" element={<Success />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/AppealFeedback" element={<AppealFeedback />} />
        </Routes>
      </Layout>
    </SessionProvider>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
