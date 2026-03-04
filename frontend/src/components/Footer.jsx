export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#4B1A55",
        color: "white",
        padding: "30px 0",
        marginTop: "50px"
      }}
    >
      <div className="container text-center">

        <h6 style={{ marginBottom: "10px" }}>
          Department of Computer Science (UG)
        </h6>

        <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
          PSGR Krishnammal College for Women <br />
          Coimbatore, Tamil Nadu, India
        </p>

        <hr style={{ opacity: 0.3, margin: "20px 0" }} />

        <small style={{ opacity: 0.8 }}>
          © {new Date().getFullYear()} PSGRKCW E-Learning Portal | Built with React & Django
        </small>

      </div>
    </footer>
  );
}
