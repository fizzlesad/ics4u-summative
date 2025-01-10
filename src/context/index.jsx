import { createContext, useState, useContext, useEffect } from "react";
import { Map } from "immutable";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
        return storedCart ? Map(JSON.parse(storedCart)) : Map();
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart.toJS()));
    }, [cart]);

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
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(StoreContext);
};