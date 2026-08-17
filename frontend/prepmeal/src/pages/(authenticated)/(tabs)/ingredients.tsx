import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useApiClient } from "../../../utils/apiClient";
import FoodGroupList from "../../../components/FoodGroup";

function Ingredients() {
    const [foodGroups, setFoodGroups] = useState([]);
    const { apiCall } = useApiClient();

    useEffect(() => {
        const fetchFoodGroups = async () => {
            try {
                const response = await apiCall('/api/food-groups', {
                    method: 'GET',
                    requiresAuth: true
                });
                const data = await response.json();
                setFoodGroups(data);

            } catch (error) {
                console.error("Error fetching food groups:", error);
            }
        }
        fetchFoodGroups();
    }, []);
    return (
        <div className="bg-[#FFC5BB] min-h-screen grid  w-full h-full grid-rows-2">
            <Navbar />
            <div className="flex flex-col justify-center align-items text-center p-12 space-y-4">
                <FoodGroupList />
            </div>

        </div>
    );
}

export default Ingredients;