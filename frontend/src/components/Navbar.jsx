import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const sidebarRef = useRef(null); // Referência para a sidebar
  const dropdownRef = useRef(null); // Referência para o dropdown

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || sessionStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      console.error("Nome do usuário não encontrado no localStorage/sessionStorage");
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:8000/api/v1/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userName');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Detectar clique fora da sidebar para fechá-la
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
        <button onClick={toggleSidebar} className="text-white text-2xl focus:outline-none">
          <FaBars />
        </button>
        <div className="text-xl font-bold"><Link to={"/"}>Logo</Link></div>
        <div className="absolute right-20 mr-10 font-bold"><Link to={"/agendamentos"}>Agendar</Link></div>
        <div className="space-x-4 hidden md:flex items-center">
          <div className="relative flex flex-col items-center" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown} 
              className="focus:outline-none text-white hover:text-blue-300 flex flex-col items-center"
            >
              <FaUser className="text-2xl" />
            </button>
            {userName && (
              <div className="text-sm text-white mt-1 font-bold">{userName}</div>
            )}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Editar Perfil
                </Link>
                <button
                  onClick={handleLogout} 
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4">
          <span className="text-lg font-semibold"></span>
          <button onClick={toggleSidebar} className="text-white text-2xl focus:outline-none">
            <FaTimes />
          </button>
        </div>
        <ul className="p-6 space-y-4">
          <li>
            <Link to="/" className="text-lg font-semibold hover:underline" onClick={toggleSidebar}>
              LOGO
            </Link>
          </li>
          <li>
            <Link to="/" className="text-lg hover:underline" onClick={toggleSidebar}>
              Início
            </Link>
          </li>
          <li>
            <Link to="/pacientes" className="text-lg hover:underline" onClick={toggleSidebar}>
              Lista de Pacientes
            </Link>
          </li>
          <li>
            <Link to="/procedimentos" className="text-lg hover:underline" onClick={toggleSidebar}>
              Procedimentos
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
