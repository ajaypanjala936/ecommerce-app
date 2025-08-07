// import { Link } from 'react-router-dom';
// import './Footer.css';

// const Footer = () => (
//   <div className="footer1-wrapper">
//     <footer className="footer1-bar"></footer>
//     <div className="footer1-content text-center text-white p-4">
//       <Link to="/privacy" className="footer-link1">
//         Privacy Policy
//       </Link>
//       <div className="copyright1">
//         © {new Date().getFullYear()} Express.com All rights reserved.
//       </div>
//     </div>
//   </div>
// );

// export default Footer;



import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <div className="footer1-wrapper" data-testid="footer">
    <footer className="footer1-bar"></footer>
    <div className="footer1-content text-center text-white p-4">
      <Link to="/privacy" className="footer-link1">
        Privacy Policy
      </Link>
      <div className="copyright1">
        © {new Date().getFullYear()} Express.com All rights reserved.
      </div>
    </div>
  </div>
);

export default Footer;