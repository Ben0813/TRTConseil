import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Login component that allows the user to log in to the application
 * Uses a form to collect the user's credentials (email and password)
 */
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("candidate");

  const BaseUrl = import.meta.env.VITE_REACT_APP_API_URL;

  /** Function that handles the login of the user
   * It sends a POST request to the API with the user's credentials
   * If the login is successful, the user is redirected to the profile page
   **/
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // API endpoint for login, based on the user type
      const url = `${BaseUrl}/api/${userType}s/login`;
      const response = await axios.post(url, {
        email,
        password,
      });

      // Destructuring the response to extract the token and user ID
      const { token, id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", userType);
      localStorage.setItem("userType", userType);
      localStorage.setItem("id", id);
      console.log("ID stocké dans le localStorage: ", id);

      if (userType === "candidate") {
        console.log("Navigation to profile-candidate");
        navigate("/profile-candidate");
        console.log("Should have navigated to profile-candidate");
      } else if (userType === "recruiter") {
        console.log("Navigation to profile-recruiter");
        navigate("/profile-recruiter");
        console.log("Should have navigated to profile-recruiter");
      } else if (userType === "administrator") {
        navigate("/profile-administrator");
      } else if (userType === "consultant") {
        navigate("/profile-consultant");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg w-full max-w-xs mb-8">
        <form onSubmit={handleLogin}>
          <label className="block text-white mb-2">Type d'utilisateur</label>
          <select
            onChange={(e) => setUserType(e.target.value)}
            value={userType}
            className="w-full bg-gray-700 text-white p-2 rounded mb-4"
          >
            <option value="candidate">Candidat</option>
            <option value="recruiter">Recruteur</option>
            <option value="administrator">Administrateur</option>
            <option value="consultant">Consultant</option>
          </select>

          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded mb-4"
          />

          <label className="block text-white mb-2">Mot de passe</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded"
          >
            Se connecter
          </button>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full max-w-xs sm:max-w-lg mx-auto">
        <button
          onClick={() => navigate("/signup-candidate")}
          className="bg-gray-700 text-white p-3 rounded mb-2 sm:mb-0 sm:mr-2"
        >
          Créer Candidat
        </button>
        <button
          onClick={() => navigate("/signup-recruiter")}
          className="bg-gray-700 text-white p-3 rounded mb-2 sm:mb-0 sm:mr-2"
        >
          Créer Recruteur
        </button>
        <button
          onClick={() => navigate("/signup-administrator")}
          className="bg-gray-700 text-white p-3 rounded mb-2 sm:mb-0 sm:mr-2"
        >
          Créer Administrateur
        </button>
      </div>
    </div>
  );
};

export default Login;
