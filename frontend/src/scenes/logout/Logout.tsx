import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch('http://localhost:9000/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Status:', response.status);
        console.log('Response:', await response.json());

        if (response.ok) {
          console.log('Logout successful');
          navigate('/login'); // redirect to login page
        } else {
          console.error('Logout failed');
          alert('Logout failed. Please try again.');
        }
      } catch (err) {
        console.error('Network error during logout:', err);
        alert('Network error. Please try again.');
      }
    };

    handleLogout();
  }, [navigate]);

  return null; 
};

export default Logout;
