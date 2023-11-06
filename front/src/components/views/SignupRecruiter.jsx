import React, { useState } from "react";
import axios from "axios";

/** SignupRecruiter is a component that renders a signup form for recruiters */
const SignupRecruiter = () => {
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

  // Function to reset form fields to default empty values
  const resetForm = () => {
    setName("");
    setFirstname("");
    setEmail("");
    setPassword("");
  };

  // Function to handle the creation of a new recruiter account
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${baseUrl}/api/recruiters`;
    try {
      const response = await axios.post(url, {
        name,
        firstname,
        email,
        password,
      });
      alert(
        "Compte créé avec succès. Bienvenue ! Un Consultant va vérifier vos données avant de vous donner accès à la plateforme."
      );
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la création du compte:", error);
      alert("Erreur lors de la création du compte. Veuillez réessayer.");
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
          <button type="submit" className="bg-green-500 p-2 rounded w-full">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupRecruiter;
