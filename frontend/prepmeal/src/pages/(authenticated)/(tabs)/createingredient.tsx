import Navbar from "../../../components/Navbar";
import IngredientForm from "../../../components/IngredientForm";

function CreateIngredient() {
    return (
        <div className="bg-[#FFC5BB] min-h-screen p-12">
            <Navbar />
            <IngredientForm />
        </div>
    );
    }

export default CreateIngredient;