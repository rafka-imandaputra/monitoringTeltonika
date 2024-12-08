import { useContext, useState } from "react";
import AuthContext from "app/contexts/JWTAuthContext";
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await axios.post('https://monitoring-teltonika-be.vercel.app/auth/login', { email, password });
            // Misalkan Anda menyimpan token atau data pengguna di sini
            setUser(response.data.user); // Menyimpan informasi user
            return true; // Menunjukkan bahwa login berhasil
        } catch (error) {
            throw error; // Melempar error untuk ditangani di tempat lain
        }
    };
    

    return { login, user };
};




export default useAuth;
