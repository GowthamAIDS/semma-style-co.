export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">SEMMA</p>
          <p className="footer-tagline">Style Co. — Digital designs for modern brands.</p>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Semma Style Co. All rights reserved.</p>
      </div>
    </footer>
  );
}
