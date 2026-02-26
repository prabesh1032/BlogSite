import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar";

export default function MasterLayout() {

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            <Navbar />
            <main className="grow">
                <Outlet />
            </main>
        </div>
    )
}