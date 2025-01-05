import "./Footer.css";
import footerBackground from "../assets/PossumFSFooterBackground.png";

function Footer() {
  return (
    <div class="footer-container">
      <img class="footer-background" src={footerBackground}></img>
      <div class="footer-container">
        <p class="footer-questions"> Questions? call 647-999-999</p>
        <p class="footer-faq"> FAQ</p>
        <p class="footer-contact-us">Contact Us</p>
        <p class="footer-help-center">Help Center</p>
        <p class="footer-legal-notices">Legal Notices</p>
        <p class="footer-cookie-preferences">Cookie Preferences</p>
        <p class="footer-only-on-possum">Only on Possum</p>
        <p class="footer-possum-shop">Possum Shop</p>
        <p class="footer-account">Account</p>
        <p class="footer-possum-gift-cards">Possum Gift Cards</p>
      </div>
    </div>
  );
}

export default Footer;
