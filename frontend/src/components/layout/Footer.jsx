import '../../styles/layout/footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <span>© {new Date().getFullYear()} NEXUM. Todos os direitos reservados.</span>
      <span className="footer-version">v1.0</span>
    </footer>
  );
}
