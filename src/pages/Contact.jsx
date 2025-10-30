import React from 'react';

const Contact = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>

      <div style={styles.form}>
        <p style={styles.label}>
          We’d love to hear from you. Click below to email us directly:
        </p>

        <a
          href="mailto:customer.service3252@gmail.com?subject=Contact%20from%20Product%20Pulse"
          style={styles.button}
        >
          Send Us an Email
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem',
    color: '#333',
  },
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  label: {
    display: 'block',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
  },
};

export default Contact;