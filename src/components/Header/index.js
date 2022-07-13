import { useContext } from 'react';
import './header.css';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { FiBarChart, FiSettings, FiLayout } from 'react-icons/fi';

export default function Header() {
    const { user } = useContext(AuthContext);

    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} />
            </div>
            <Link to="/dashboard">
                <FiBarChart color='#FFF' size={24} />
                Dashboard
            </Link>
            <Link to="/customizer">
                <FiLayout color='#FFF' size={24} />
                Personalizar
            </Link>
            <Link to="/settings">
                <FiSettings color='#FFF' size={24} />
                Configurações
            </Link>
        </div>
    )
}