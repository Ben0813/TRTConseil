import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Retrieve the token from local storage to check authentication status
const token = localStorage.getItem("token");

/**
 * ProfileAdministrator component represents the administrator's profile page
 * Allows an administrator to create consultant accounts
 */
const ProfileAdministrator = () => {
  // State variables to store form data
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Navigate hook to redirect the user
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

  // Function to reset form fields to default empty values
  const resetForm = () => {
    setName("");
    setFirstname("");
    setEmail("");
    setPassword("");
  };

  // Effect hook to check if the user is authenticated and has the administrator role
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    const hasAdminRole = localStorage.getItem("role") === "administrator";
    // If not authenticated or not an administrator, redirect to home page
    if (!isAuthenticated || !hasAdminRole) {
      navigate("/");
    }
  }, [navigate]);

  // Function to handle user logout
  const handleLogout = () => {
    //remove authentication info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    //redirect to logout page
    navigate("/");
  };

  // Function to handle the creation of a new consultant account
  const handleCreateConsultant = async (e) => {
    e.preventDefault();
    const url = `${baseUrl}/api/consultants`;

    try {
      const response = await axios.post(url, {
        name,
        firstname,
        email,
        password,
      });
      alert("Compte créé avec succès. trop fort chef !");
      resetForm();
    } catch (error) {
      const errors = error.response.data.errors;
      const message = errors.map((err) => err.msg).join(" ");
      setErrorMessage(message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen text-white">
      <div className="mb-8 flex justify-end w-full p-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
      <div className="bg-gray-800 p-8 rounded-lg w-full md:w-1/3 my-8">
        <h1 className="text-2xl mb-5">Créer un compte consultant</h1>
        <form onSubmit={handleCreateConsultant}>
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
          <input
            type="text"
            placeholder="Prénom"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-gray-700 w-full mb-4"
          />
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              {errorMessage}
            </div>
          )}
          <button type="submit" className="bg-green-500 p-2 rounded w-full">
            Créer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileAdministrator;
