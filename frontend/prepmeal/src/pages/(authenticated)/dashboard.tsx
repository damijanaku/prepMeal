import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-[#FFC5BB] min-h-screen">
            <Navbar />
            <div className="grid min-h-[calc(100vh-80px)] w-full grid-cols-2 pt-20">
                <div className="flex flex-col justify-center items-center text-center p-8 space-y-4">
                    <h1 className="font-bold text-4xl text-gray-900">
                        Cooking and Taking Care of Your Health, One Meal at a Time!
                    </h1>
                    <p className="font-semibold text-gray-600 text-xl">
                        Add your own Ingredients and Recipes, and let us help you track your health and nutrition.
                    </p>
                </div>
                <div className="flex items-center justify-center p-8">
                    <img src="../../assets/mediaposts.jpg" alt="PrepMeal Logo" className="h-3/4" />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;