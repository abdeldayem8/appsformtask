import React, { useState } from 'react';
import './style.css';

const Form = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    file: null, 
  });

  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file') {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        file: file, 
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    const phonePattern = /^\+?(\d{1,3})?[-.●]?\(?\d{3}\)?[-.●]?\d{3}[-.●]?\d{4}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phonePattern.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});

      // Create a FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('image', formData.file); 

      try {
        const response = await fetch('https://www.appssquare.sa/api/submit', {
          method: 'POST',
          body: formDataToSend, // send formdata
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        setServerResponse(data); // handle success response

      } catch (error) {
        console.error('Error:', error);
        setServerResponse(error.message); // handle error response
      }

    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className='formstyle'>
      <form onSubmit={handleSubmit} method='post'>
        <div>
          <input 
            type='text' 
            name='username' 
            placeholder='Username' 
            value={formData.username} 
            onChange={handleInputChange} 
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div>
          <input 
            type='text' 
            name='email' 
            placeholder='Email' 
            value={formData.email} 
            onChange={handleInputChange} 
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <input 
            type='text' 
            name='phone' 
            placeholder='Phone Number' 
            value={formData.phone} 
            onChange={handleInputChange} 
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div>
          <input 
            type='password' 
            name='password' 
            placeholder='Password' 
            value={formData.password} 
            onChange={handleInputChange} 
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
      
        <div>
          <input 
            type='file' 
            name='file' 
            onChange={handleInputChange} 
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {/* Display server response */}
      {serverResponse && <div className="server-response">{serverResponse}</div>}
    </div>
  );
};

export default Form;
