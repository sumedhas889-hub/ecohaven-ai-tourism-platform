import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Destinations() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen p-10 bg-[#F5F7F2]">
        <h1 className="text-4xl font-bold text-[#2D4F3A]">
           Destinations
        </h1>

        <p className="mt-4 text-gray-600">
          Explore beautiful eco-friendly destinations and unique homestays around the world.
        </p>
      </main>

      <Footer />
    </>
  );
}