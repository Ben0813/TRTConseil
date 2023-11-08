import React, { useState } from "react";
import axios from "axios";

/**
 * SignupAdministrator component is responsible for rendering the sign-up form for administrators
 */
const SignupAdministrator = () => {
  // State hooks to store form inputs
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

  // Function to reset form fields to default empty values
  const resetForm = () => {
    setName("");
    setFirstname("");
    setEmail("");
    setPassword("");
  };

  // Function to handle the creation of a new administrator account
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${baseUrl}/api/administrators`;
    try {
      const response = await axios.post(url, {
        name,
        firstname,
        email,
        password,
      });
      alert("Compte créé avec succès. Bienvenue Chef !");
      resetForm();
    } catch (error) {
      const errors = error.response.data.errors;
      const message = errors.map((err) => err.msg).join(" ");
      setErrorMessage(message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-full md:w-1/3 my-8">
        <form onSubmit={handleSubmit}>
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
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupAdministrator;
