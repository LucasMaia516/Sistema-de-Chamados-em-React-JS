import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyDVH7jxUHwswKDA2pAF3wnbP9DkPGROsV0",
    authDomain: "sistemadechamados-97003.firebaseapp.com",
    projectId: "sistemadechamados-97003",
    storageBucket: "sistemadechamados-97003.appspot.com",
    messagingSenderId: "127824057726",
    appId: "1:127824057726:web:22894c67f587d79eb18f2f",
    measurementId: "G-YQ8K0FF1B9"
};

const firebaseApp = initializeApp(firebaseConfig)


const auth = getAuth(firebaseApp) // Configuração de autentificação
const db = getFirestore(firebaseApp) // Configuração do banco de dados
const storage = getStorage(firebaseApp) // Configuração para utilizar mídias como imagens e salvar no banco de dados

export {auth, db, storage}