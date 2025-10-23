import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('http://localhost:4242/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setStatus(data.success ? 'sent' : 'error');
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>Send</button>

        {status === 'sending' && <p style={styles.status}>Sending...</p>}
        {status === 'sent' && <p style={{ ...styles.status, color: 'green' }}>✅ Message sent!</p>}
        {status === 'error' && <p style={{ ...styles.status, color: 'red' }}>❌ Something went wrong.</p>}
      </form>
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
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    height: '120px',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  status: {
    marginTop: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default Contact;