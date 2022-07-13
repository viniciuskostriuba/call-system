import { useState, useContext } from 'react';
import './settings.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import { toast } from 'react-toastify';
import { doc, updateDoc } from "firebase/firestore";
import { async } from '@firebase/util';

export default function Settings() {
    const { user, logOut, firebaseUsers, setUser, storageUser, storage, ref, uploadBytes, getDownloadURL } = useContext(AuthContext);
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            } else {
                toast.info('Aceitamos apenas PNG ou JPEG');
                setImageAvatar(null);
                return null;
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;
        const uploadTask = ref(storage, `images/${currentUid}/${imageAvatar.name}`);
        uploadBytes(uploadTask, imageAvatar)
            .then(async () => {
                await getDownloadURL(ref(storage, uploadTask))
                    .then(async (url) => {
                        let urlFoto = url;
                        await updateDoc(doc(firebaseUsers, user.uid), {
                            avatarUrl: urlFoto,
                            nome: nome
                        })
                            .then(() => {
                                let data = {
                                    ...user,
                                    avatarUrl: urlFoto,
                                    nome: nome
                                };
                                setUser(data);
                                storageUser(data);
                                toast.success('Atualizado com Sucesso!')
                            })
                            .catch(() => {
                                toast.error('Ops não foi possível buscar seu nome e foto :(')
                            })
                    })
                    .catch(() => {
                        toast.error('Ops não foi possível atualizar seu nome e foto :(')
                    })
            });
    }

    async function handleSave(e) {
        e.preventDefault();

        if (imageAvatar === null && nome !== '') {
            await updateDoc(doc(firebaseUsers, user.uid), {
                nome: nome,
            })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                    };
                    setUser(data);
                    storageUser(data);
                    toast.success('Alteramos seu nome com sucesso :)')
                })
                .catch(() => {
                    toast.error('Ops não foi possível atualizar seu nome :(')
                })
        } else if (nome !== '' && imageAvatar !== null) {
            handleUpload();
        }
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Meu Perfil">
                    <FiSettings size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSave}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#FFF' size={25} />
                            </span>
                            <input type='file' accept='image/*' onChange={handleFile} /><br />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" />
                                :
                                <img src={avatarUrl} width="250" height="250" />
                            }
                        </label>
                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />
                        <button type='submit'>Salvar</button>
                    </form>
                </div>
                <div className='container'>
                    <button className='logout-btn' onClick={() => logOut()}>Sair</button>
                </div>
            </div>
        </div>
    )
}