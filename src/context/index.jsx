import { createContext, useState, useContext, useEffect } from "react";
import { Map } from "immutable";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

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

    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        try {
            const parsedCart = storedCart ? JSON.parse(storedCart) : {};
            return Map(parsedCart); // Convert to Immutable.js Map
        } catch (error) {
            console.error("Failed to parse cart from localStorage:", error);
            return Map(); // Return an empty Map if parsing fails
        }
    });

    useEffect(() => {
        if (Map.isMap(cart)) {
            localStorage.setItem("cart", JSON.stringify(cart.toJS()));
        } else {
            console.warn("Cart is not a valid Immutable.js Map");
        }
    }, [cart]);

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