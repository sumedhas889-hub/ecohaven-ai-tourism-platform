import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Test from "./components/Test";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <div className="grid md:grid-cols-3 gap-6 p-8 bg-slate-[#F5F7F2]">
        <Test
          title="Mountain Homestay🏔️"
          description="Experience nature in a sustainable mountain retreat."
        />

        <Test
          title="Riverside Eco Retreat🌊"
          description="Relax in a peaceful eco-friendly riverside stay."
        />

         <Test
          title="Forest Cabin🌲"
          description="Escape into the serenity of nature with a cozy cabin surrounded by lush green forests."
        />
      </div>

      <Footer />
    </>
  );
}