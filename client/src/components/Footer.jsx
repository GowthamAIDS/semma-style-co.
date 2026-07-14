export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0', marginTop: 80 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>SEMMA</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Style Co. — Digital designs for modern brands.</p>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>&copy; {new Date().getFullYear()} Semma Style Co. All rights reserved.</p>
      </div>
    </footer>
  );
}
