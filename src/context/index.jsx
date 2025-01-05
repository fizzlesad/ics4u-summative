import { createContext, useState, useContext } from "react";
import { Map } from 'immutable';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [genres, setGenres] = useState([
        {
            genre: "Action",
            id: 28,
        },
        {
            genre: "Family",
            id: 10751,
        },
        {
            genre: "Science Fiction",
            id: 878,
        },
        {
            genre: "Adventure",
            id: 12,
        },
        {
            genre: "Fantasy",
            id: 14,
        },
        {
            genre: "Animation",
            id: 16,
        },
        {
            genre: "History",
            id: 36,
        },
        {
            genre: "Thriller",
            id: 53,
        },
        {
            genre: "Comedy",
            id: 35,
        },
        {
            genre: "Horror",
            id: 27,
        },
        {
            genre: "Western",
            id: 37,
        }
    ]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [cart, setCart] = useState(Map());

    return (
        <StoreContext.Provider value={{ email, setEmail, firstName, setFirstName, lastName, setLastName, genres, setGenres, selectedGenres, setSelectedGenres, cart, setCart }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}
