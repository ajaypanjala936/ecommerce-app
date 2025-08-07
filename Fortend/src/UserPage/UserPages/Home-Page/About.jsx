import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaUsers, FaRocket } from 'react-icons/fa';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <div className="about-page">
      <header className="about-header">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">
          Discover our story, mission, and the team behind your favorite online store.
        </p>
      </header>

      <main className="about-content">
        <section className="about-mission">
          <h2 className="section-title">
            <FaRocket className="section-icon" /> Our Mission
          </h2>
          <p>
            At Our Store, we strive to provide high-quality products with exceptional customer
            service. Our mission is to make shopping effortless, enjoyable, and accessible for
            everyone, while promoting sustainability and innovation.
          </p>
        </section>

        <section className="about-story">
          <h2 className="section-title">Our Story</h2>
          <p>
            Founded in 2020, Our Store started as a small passion project to bring unique,
            thoughtfully curated products to customers worldwide. Today, we’re proud to serve
            thousands of happy customers, offering a wide range of products backed by our
            commitment to quality and trust.
          </p>
          <div className="about-image-container">
            <img
              src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
              alt="Our Store Team"
              className="about-image"
            />
          </div>
        </section>

        <section className="about-team">
          <h2 className="section-title">
            <FaUsers className="section-icon" /> Meet Our Team
          </h2>
          <p>
            Our dedicated team of designers, developers, and customer service experts work
            tirelessly to ensure you have the best shopping experience. We’re a diverse group
            united by a passion for excellence and customer satisfaction.
          </p>
        </section>

        <section className="about-cta">
          <h2 className="section-title">Ready to Shop?</h2>
          <p>Explore our collection and find something you love!</p>
          <button
            className="shop-now-btn"
            onClick={handleShopNow}
            aria-label="Shop now"
          >
            <FaShoppingBag className="btn-icon" /> Shop Now
          </button>
        </section>
      </main>
    </div>
  );
};

export default About;