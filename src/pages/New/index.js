import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import './new.css';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';


export default function New() {
    const {id} = useParams();
    const history = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user, firebaseCustomers, getDocs, setDoc, doc, firebaseTickets, getDoc, updateDoc } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers() {
            await getDocs(firebaseCustomers)
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia,
                        })
                    })
                    if (lista.length === 0) {
                        toast.info('Nenhuma empresa encontrada!');
                        setCustomers([{ id: '1', nomeFantasia: 'Freela' }]);
                        setLoadCustomers(false);
                        return;
                    }
                    setCustomers(lista);
                    setLoadCustomers(false);
                    
                    if(id) {
                        loadId(lista);
                    }

                })
                .catch(() => {
                    toast.error('Tivemos um problema na consulta dos dados');
                    setLoadCustomers(false);
                    setCustomers([{ id: '1', nomeFantasia: '' }]);
                })
        }
        loadCustomers();
    }, [id]);

    async function loadId(lista) {
        await getDoc(doc(firebaseTickets, id))
        .then((snapshot)=> {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch(()=> {
            toast.error("Houve um erro no ID");
            setIdCustomer(false);
        })
    }

    async function handleRegister(e) {
        e.preventDefault();

        if(idCustomer) {
            await updateDoc(doc(firebaseTickets, id), {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(()=> {
                toast.success('Chamado Editado com sucesso!');
                setCustomerSelected(0);
                setComplemento('');
                history('/dashboard');
            })
            .catch((err)=> {
                toast.error('Ops houve um erro ao registrar, tente mais tarde')
                console.log(err)
            })

            return;
        }

        await setDoc(doc(firebaseTickets), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
            .then(() => {
                toast.success('Chamado registrado com sucesso :)');
                setComplemento('');
                setCustomerSelected(0);
            })
            .catch(() => {
                toast.error('Ops não foi possível registrar :(');
            })
    }

    //Chamado quando troca o assunto
    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    //Chamado quando troca o status
    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    //Chamado quando troca de cliente
    function handleChangeCustomers(e) {
        setCustomerSelected(e.target.value);
    }

    return (
        <div>
            <Header />

            <div className='content'>
                <Title name="Novo Chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando... " />
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    )
                                })}
                            </select>
                        )}


                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'} />
                            <span>Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Em Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Em Progresso'} />
                            <span>Em Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={status === 'Atendido'} />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder='Descreva o seu problema (opcional).'
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)} />

                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}