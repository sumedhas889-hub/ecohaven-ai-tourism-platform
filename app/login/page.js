import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen p-10 bg-[#F5F7F2]">
        <h1 className="text-4xl font-bold text-[#2D4F3A]">
          👤 Login
        </h1>

        <p className="mt-4 text-gray-600">
          Sign in to manage bookings, save favorite stays, and plan your next eco adventure.
        </p>
      </main>

      <Footer />
    </>
  );
}