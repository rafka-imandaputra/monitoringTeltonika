import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './testimoni.css';

const testimonials = [
  {
    quote: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.",
    name: "John Smith",
    position: "Marketing Director at XYZ Corp"
  },
  {
    quote: "Positivus has transformed our online presence and helped us scale our business in ways we didn't think were possible. Their team is knowledgeable and proactive.",
    name: "Jane Doe",
    position: "CEO at ABC Inc"
  },
];

const Testimoni = () => {
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="testimonial-container">
      <div className="title">
        <h1>Testimonial</h1>
        <p>Dengarkan hasil dari testimoni orang lain</p>
      </div>
      <div className="slider-container">
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-content">
                <p className="quote">{testimonial.quote}</p>
                <div className="author">
                  <h3>{testimonial.name}</h3>
                  <p>{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimoni;
