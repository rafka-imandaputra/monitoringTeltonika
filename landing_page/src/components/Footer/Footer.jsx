import './footer.css';
import { FaTruck, FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div>
        <h1 className="footer-logo">
            <FaTruck />
            LOGO.
        </h1>
        <p>Monitoring Truck Cooling and Cold Storage</p>
        </div>
        <div>
          <a href="/" className='logo'>
          <FaFacebookSquare />
          </a>
          <a href="/" className='logo'>
          <FaInstagramSquare />
          </a>
          <a href="/" className='logo'>
          <FaSquareXTwitter/>
          </a>
        </div>
      </div>
    
      <div className="bottom">
        <div>
           <h4>Fast Links</h4>
           <a href="/">Home</a>
           <a href="/">Layanan</a>
           <a href="/">Testimoni</a>
           <a href="/">Tentang Kami</a>
        </div>

        <div>
           <h4>Kontak Kami</h4>
           <a href="/">Email : info@truk.com</a>
           <a href="/">No. telp : 889-1200-0000</a>
           <a href="/">No. telp : 889-1200-899</a>
           <a href="/">Alamat : Jl. Abcd, Kota B, 45222</a>
        </div>

        <div>
           <h4>Tentang Kami</h4>
           <a href="/">Dari mahasiswa POLBAN</a>
        </div>
        
        <div>
           <h4>Help</h4>
           <a href="/">Contact</a>
           <a href="/">Contact</a>
           <a href="/">Contact</a>
        </div>
      </div>
      
    </div>
  );
};

export default Footer;

