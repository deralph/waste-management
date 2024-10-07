import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase.ts";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";

const AdminCreation = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        email,
        role: "admin",
      });
      console.log("User created up: ", user);

      navigate("/admin/approve"); // Navigate to user page for normal users
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-4 py-8 md:px-0">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          {/* Left Image Section */}
          <div className="hidden md:block md:w-1/2 bg-gray-100 p-10">
            <div className="flex items-center justify-center">
              <img
                src="/waste_management.jpg"
                alt="profile pics"
                className="max-w-full h-auto"
              />
            </div>
          </div>
          {/* Right Form Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <h2 className="text-red-900 text-2xl font-bold text-center mb-8">
              Create an admin account
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreation;
