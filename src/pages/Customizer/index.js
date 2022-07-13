import { useState, useContext } from "react";
import { doc, setDoc } from "firebase/firestore";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiLayout } from "react-icons/fi";
import { AuthContext } from '../../contexts/auth';
import { async } from "@firebase/util";
import { toast } from "react-toastify";

export default function Customizer() {
    const { user, logOut, setUser, storageUser, storage, ref, uploadBytes, firebaseCustomers } = useContext(AuthContext);
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e) {
        e.preventDefault();

        if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            await setDoc(doc(firebaseCustomers), {
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(()=> {
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.success('Empresa cadastrada com sucesso!');
            })
            .catch(()=> {
                toast.error('Error ao cadastrar a empresa!');
            })
        } else {
            toast.error('Preencha todos os campos!')
        }
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Personalizar">
                    <FiLayout size={25} />
                </Title>
                <div className="container">
                    <form className="form-profile customers" onSubmit={handleAdd}>
                        <label>Nome Fantasia</label>
                        <input type="text" placeholder="Nome da sua Empresa" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />

                        <label>CNPJ</label>
                        <input type="text" placeholder="Numero CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />

                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da sua Empresa" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}