import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import './signin.css';
import logo from '../../assets/logo.png';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    if(email !== '' && password !== '') {
      login(email, password)
    }
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt="Sistema Logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <input type="text" placeholder='email@email.com' value={email} onChange={(e)=> setEmail(e.target.value)} />
          <input type="password" placeholder='senha' value={password} onChange={(e)=> setPassword(e.target.value)} />
          <button type='submit'>{loadingAuth ? 'Carregando...' : 'Entrar'}</button>
        </form>
        <Link to="/signup">Cadastrar</Link>
      </div>
    </div>
  );
}

export default SignIn;
