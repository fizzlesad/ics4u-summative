import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStoreContext } from "../context";
import { useNavigate } from "react-router-dom";
import "./CartView.css";

const CartView = () => {
    const { cart, setCart } = useStoreContext();
    const navigate = useNavigate();
    return (
        <div className="cart-container">
            <Header />
            <button onClick={() => checkout()}>Checkout</button>
            {cart.entrySeq().map(([key, value]) => {
                return (
                    <div key={key} className="cart-item">
                        <img className="images" src={value.url} alt={value.title} />
                        <div className="item-details">
                            <p className="item-title">{value.title}</p>
                            <button className="remove-button" onClick={() => setCart((check) => check.delete(key))}>
                                Remove
                            </button>
                        </div>
                    </div>
                );
            })}
            <button className="back-button" onClick={() => navigate("/movies")}>
                Back
            </button>
            <Footer />
        </div>
    );
};

export default CartView;
