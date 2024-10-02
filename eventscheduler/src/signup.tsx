import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const navigate =useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    
    setErrors([]);
    
   
    const newErrors: string[] = [];
    if (!formData.email || !formData.password || !formData.name) {
      newErrors.push('All fields are required.');
    }

    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/Signup', formData);
      if (response.data.success=== true) {
        localStorage.setItem('userId', response.data._id);
        navigate('/Adddata');
      } else {
        setErrors(['Failed to create account']);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setErrors(['An error occurred while creating the account.']);
    }
  };
return(
  <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create new account 
      </h2>
  </div>
  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form method="post" onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
              </label>
              <div className="mt-2">
                  <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
              </div>
          </div>

          <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
              </label>
              <div className="mt-2">
                  <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
              </div>
          </div>

          <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
              </label>
              <div className="mt-2">
                  <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
              </div>
          </div>

          <div>
              <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                  Sign up
              </button>
          </div>
      </form>
      {errors.length > 0 && (
          <div className="errors">
            {errors.map((error, index) => <p key={index}>{error}</p>)}
          </div>
        )}
      <p className="mt-10 text-center text-sm text-gray-500">
  Already have an account?{' '}
  <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
    Signin Here
  </Link>
</p>
  </div>
</div>

)
  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        {errors.length > 0 && (
          <div className="errors">
            {errors.map((error, index) => <p key={index}>{error}</p>)}
          </div>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
