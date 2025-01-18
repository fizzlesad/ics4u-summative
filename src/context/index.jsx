import { createContext, useState, useContext, useEffect } from "react";
import { Map } from "immutable";
import { useNavigate } from "react-router-dom";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    let navigate;
    try {
        navigate = useNavigate();
    } catch {
        console.warn("useNavigate cannot be used outside a Router");
    }

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                delete parsedUser.password;
                return parsedUser;
            } catch (error) {
                console.error("Failed to parse user from localStorage:", error);
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        if (!user && navigate) {
            navigate("/");
        } else {
            const storedUser = localStorage.getItem("user");
            const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

            if (JSON.stringify(user) !== JSON.stringify(parsedStoredUser)) {
                const safeUser = { ...user };
                delete safeUser.password;
                localStorage.setItem("user", JSON.stringify(safeUser));
            }
        }
    }, [user, navigate]);

    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        try {
            const parsedCart = storedCart ? JSON.parse(storedCart) : {};
            return Map(parsedCart);
        } catch (error) {
            console.error("Failed to parse cart from localStorage:", error);
            return Map();
        }
    });

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        const parsedCart = storedCart ? JSON.parse(storedCart) : null;

        if (cart.toJS && JSON.stringify(cart.toJS()) !== JSON.stringify(parsedCart)) {
            localStorage.setItem("cart", JSON.stringify(cart.toJS()));
        }
    }, [cart]);

    const [genres, setGenres] = useState([
        { genre: "Action", id: 28 },
        { genre: "Family", id: 10751 },
        { genre: "Science Fiction", id: 878 },
        { genre: "Adventure", id: 12 },
        { genre: "Fantasy", id: 14 },
        { genre: "Animation", id: 16 },
        { genre: "History", id: 36 },
        { genre: "Thriller", id: 53 },
        { genre: "Comedy", id: 35 },
        { genre: "Horror", id: 27 },
        { genre: "Western", id: 37 },
    ]);

    const [selectedGenres, setSelectedGenres] = useState([]);

    const [pastPurchases, setPastPurchases] = useState([]);

    return (
        <StoreContext.Provider
            value={{
                user,
                setUser,
                genres,
                setGenres,
                selectedGenres,
                setSelectedGenres,
                cart,
                setCart,
                pastPurchases,
                setPastPurchases,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(StoreContext);
};