import { useState, createContext, useEffect } from 'react';
import db from '../services/firebaseConnection';
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, limit, startAfter, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const firebaseUsers = collection(db, "users");
  const firebaseCustomers = collection(db, "customers");
  const firebaseTickets = collection(db, "chamados");
  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {

    function loadStorage() {
      const storageUser = localStorage.getItem("SistemaUser");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadStorage();
  }, [])

  //Logando user
  async function login(email, password) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await getDoc(doc(firebaseUsers, userCredential.user.uid), {
        }).then((snapshot) => {
          let data = {
            uid: userCredential.user.uid,
            nome: snapshot.data().nome,
            email: userCredential.user.email,
            avatarUrl: snapshot.data().avatarUrl,
          };

          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          toast.success(`Bem vindo! ${snapshot.data().nome}`);
        })
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          toast.error('Usuário não encontrado');
        } else if (error.code === 'auth/wrong-password') {
          toast.error('Senha incorreta');
        } else {
          console.log(error);
        }
        setLoadingAuth(false);
      })
  }

  //cadastrando user
  async function signUp(email, password, nome) {
    setLoadingAuth(true);
    await createUserWithEmailAndPassword(auth, email, password, nome)
      .then(async (userCredential) => {
        await setDoc(doc(firebaseUsers, userCredential.user.uid), {
          nome: nome,
          avatarUrl: null,
          email: email,
        })
          .then(() => {
            let data = {
              uid: userCredential.user.uid,
              nome: nome,
              email: userCredential.user.email,
              avatarUrl: null
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success(`Bem vindo ${nome}`);
          })

      })
      .catch((error) => {
        setLoadingAuth(false);
        if (error.code === 'auth/weak-password') {
          toast.error('Senha Muito Fraca');
        } else if (error.code === 'auth/email-already-in-use') {
          toast.error('Email já cadastrado');
        }

        toast.error('Ops algo deu errado!');
        setLoadingAuth(false);
        console.log(error.message);
      });
  }

  // Salvando user no cache do browser
  function storageUser(data) {
    localStorage.setItem('SistemaUser', JSON.stringify(data));
  }

  // Deslogando user
  async function logOut() {
    await signOut(auth);
    localStorage.removeItem('SistemaUser');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signUp,
        logOut,
        login,
        loadingAuth,
        firebaseUsers,
        setUser,
        storageUser,
        storage,
        ref,
        uploadBytes,
        getDownloadURL,
        firebaseCustomers,
        getDocs,
        firebaseTickets,
        doc,
        setDoc,
        query, 
        orderBy, 
        limit,
        startAfter,
        getDoc,
        updateDoc
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;