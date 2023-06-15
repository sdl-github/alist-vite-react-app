import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { History } from "./History";
import MainLayout from "./layouts/MainLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <App />
            },
            {
                path: "/history",
                element: <History />
            }
        ]
    },
]);

export default router