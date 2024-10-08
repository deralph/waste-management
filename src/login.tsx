import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase.ts";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "./authContext.tsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [Admin, setAdmin] = useState(false); // New state for admin sign-up

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        // Create a new user and assign the role
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await addDoc(collection(db, "users"), {
          email,
          role: Admin ? "admin" : "user", // Assign role based on Admin state
        });
        console.log("User signed up: ", user);

        navigate("/userpage"); // Navigate to user page for normal users
      } else {
        // User login logic
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in: ", user);

        if (isAdmin) {
          navigate("/admin/approve"); // Navigate to admin dashboard
        } else {
          navigate("/userpage"); // Navigate to the user page
        }
      }
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
              {isSignUp ? "Create an Account" : "Welcome back!"}
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

              {!isSignUp && (
                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={Admin}
                      onChange={(e) => setAdmin(e.target.checked)}
                    />
                    <span className="ml-2">Sign in as Admin</span>
                  </label>
                </div>
              )}

              <button className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition">
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>
            <div className="my-4"></div>
            <p className="text-center text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                className="underline ml-1"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
