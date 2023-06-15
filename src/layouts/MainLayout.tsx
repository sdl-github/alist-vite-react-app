import NavBar from "@/components/layout/navbar";
import Footer from "@douyinfe/semi-ui/lib/es/navigation/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            <div className="fixed top-0 h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
            <NavBar />
            <main className="min-h-screen w-full">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}