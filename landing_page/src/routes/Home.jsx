import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero";
import Layanan from "../components/Layanan";
import Testimoni from "../components/Testimoni";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero 
        cName="hero"
        title="Monitoring Truck Cooling and Cold Storage"
        heroImg={require('../truk2.jpg')}
        text="Memonitoring menggunakan Teltonika yang merupakan perangkat jaringan 
        yang dirancang untuk menyediakan konektivitas internet 
        melalui jaringan seluler dan, dalam beberapa model, 
        juga bisa terhubung melalui jaringan kabel."
        buttonText="Lihat Teltonika Kami"
        url="/"
        btnClass="show"
      />
      <Layanan />
      <Testimoni />
      <Footer />
    </div>
  );
}

export default Home;
