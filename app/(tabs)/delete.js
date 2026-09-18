import { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import BuscarAnime from './getbyid';

const API_KEY = 'cv_1VfeU3pOZVBNE_YHODnm8KHctij77rwrhKxtmTiqTOKnuv6IdlMBBnDOEwcqApVE';
const api = axios.create({
    baseURL: 'https://api-ds.codeverse.dev.br',
    headers: {
        'x-api-key': API_KEY,
    },
});

export default function ExcluirAnimes() {
    const [animes, setAnimes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const[erro, setErro] = useState(null);
    const [excluindoId, setExcluindo] = useState(null)
    async function buscarIdAnime(){
        setCarregando(true);
        setErro(null);

        try{
            const resposta = await api.get("/api/animes", {
                params :{ limit: 50}
            })
        }catch(error){
            setErro("Não foi possivel carregar os animes");
        }finally{
        setCarregando(false);
        }
    }

    //roda conforme a pagina recarrega
    useEffect(()=>{
        BuscarAnime();
    }, []);

    async function ExcluirAnime(id){
        setExcluindo(id);

        try{
            await api.delete(`/api/animes/${id}`);
            setAnimes((atual) => atual.filter((item)=> item.id !== id));
        }catch(erro){
            Alert.alert("Chefe não deu para excluir o anime digitado");
        }finally{
            setExcluindo(null);
        }
    }
    function confirmarExclusao(anime){
        Alert.alert("TEM CERTEZA QUE QUER EXLCUIR? ")
    }
}