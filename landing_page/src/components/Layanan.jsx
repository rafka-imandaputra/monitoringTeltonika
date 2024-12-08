import "./layanan.css";
import layananData from "./layananData";

function Layanan() {
  return (
    <div className="layanan">
      <h1>Layanan</h1>
      <p>Berikut layanan yang kami berikan</p>
      <div className="layanancard">
        {layananData.map((item, index) => (
          <div className="layanan-item" key={index}>
            <div className="item-heading">
              {item.heading}
              <item.icon className="item-icon" />
            </div>
            <p className="item-text">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Layanan;
