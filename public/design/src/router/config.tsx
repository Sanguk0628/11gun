
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ReviewPage from "../pages/review/page";
import MyPage from "../pages/mypage/page";
import AuthPage from "../pages/auth/page";
import MyReviewsPage from "../pages/myreviews/page";
import LikedGymsPage from "../pages/likedgyms/page";
import GymDetailPage from "../pages/gymdetail/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/gym/:id",
    element: <GymDetailPage />,
  },
  {
    path: "/review",
    element: <ReviewPage />,
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "/myreviews",
    element: <MyReviewsPage />,
  },
  {
    path: "/likedgyms",
    element: <LikedGymsPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
