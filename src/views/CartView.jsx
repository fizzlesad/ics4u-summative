import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStoreContext } from "../context";
import { useNavigate } from "react-router-dom";
import "./CartView.css";

const CartView = () => {
    const { cart, setCart } = useStoreContext();
    const navigate = useNavigate();

    const handleRemoveItem = (key) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.delete(key);
            localStorage.setItem("cart", JSON.stringify(updatedCart.toJS()));
            return updatedCart;
        });
    };

    const checkout = () => {
        if (cart.size === 0) {
            alert("Your cart is empty. Add movies before checking out!");
            return;
        }
        setCart(() => {
            localStorage.removeItem("cart");
            return cart.clear();
        });
        alert("Thank you for your purchase!");
        navigate("/movies");
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
