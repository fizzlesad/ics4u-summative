import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStoreContext } from "../context";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"; // Ensure getDoc is imported
import "./CartView.css";

const CartView = () => {
    const { cart, setCart, user } = useStoreContext();
    const navigate = useNavigate();

    const handleRemoveItem = (key) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.delete(key);
            localStorage.setItem("cart", JSON.stringify(updatedCart.toJS()));
            return updatedCart;
        });
    };

    const checkout = async () => {
        if (cart.size === 0) {
            alert("Your cart is empty. Add movies before checking out!");
            return;
        }

        try {
            const purchasedMoviesFromCart = Array.from(cart.values())
                .map((item) => item.title)
                .filter((title) => title);

            if (purchasedMoviesFromCart.length === 0) {
                throw new Error("No valid movies in cart");
            }

            const userDoc = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDoc);

            let existingPurchasedMovies = [];

            if (userSnap.exists()) {
                const userData = userSnap.data();
                existingPurchasedMovies = userData.purchasedMovies || [];
            } else {
                // If the document doesn't exist, create it with an empty purchasedMovies array
                await setDoc(userDoc, { purchasedMovies: [] });
            }

            const updatedPurchasedMovies = [...new Set([...existingPurchasedMovies, ...purchasedMoviesFromCart])];

            await updateDoc(userDoc, {
                purchasedMovies: updatedPurchasedMovies,
            });

            setCart(() => {
                localStorage.removeItem("cart");
                return cart.clear();
            });

            alert("Thank you for your purchase!");
            navigate("/movies");
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("An error occurred during checkout. Please try again.");
        }
    };

    return (
        <div className="cart-container">
            <Header />
            <button className="checkout-button" onClick={checkout}>
                Checkout
            </button>
            {cart.entrySeq().map(([key, value]) => (
                <div key={key} className="cart-item">
                    <img className="images" src={value.url} alt={value.title} />
                    <div className="item-details">
                        <p className="item-title">{value.title}</p>
                        <button
                            className="remove-button"
                            onClick={() => handleRemoveItem(key)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <button className="back-button" onClick={() => navigate("/movies")}>
                Back
            </button>
            <Footer />
        </div>
    );
};

export default CartView;