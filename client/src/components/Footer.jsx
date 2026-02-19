import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo-icon">S</div>
          <span className="logo-text">Servify</span>
          <p className="footer-tagline">Connecting people with trusted professionals.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#">Browse All</a>
            <a href="#">Become a Provider</a>
            <a href="#">Pricing</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Servify. All rights reserved.</span>
      </div>
    </footer>
  );
}
