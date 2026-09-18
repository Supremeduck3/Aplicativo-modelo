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
   return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.header}>
                    <Text style={styles.tituloPagina}>Excluir anime</Text>
                    <Text style={styles.subtitulo}>DELETE /api/animes/:id</Text>
                </View>

                {carregando && <ActivityIndicator style={{ marginVertical: 16 }} />}
                {erro && <Text style={styles.erro}>{erro}</Text>}

                {!carregando &&
                    animes.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
                            <View style={styles.info}>
                                <Text style={styles.titulo}>{item.title}</Text>
                            </View>
                            <Pressable
                                style={styles.botaoExcluir}
                                onPress={() => confirmarExclusao(item)}
                                disabled={excluindoId === item.id}>
                                <Text style={styles.botaoExcluirTexto}>
                                    {excluindoId === item.id ? '...' : 'Excluir'}
                                </Text>
                            </Pressable>
                        </View>
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fbff' },
    conteudo: { padding: 24, paddingBottom: 48 },
    header: { marginBottom: 16 },
    tituloPagina: { fontSize: 24, fontWeight: '800', color: '#102542' },
    subtitulo: { fontSize: 14, color: '#5f6b7a', marginTop: 2 },

    erro: { color: '#c62828', marginTop: 12 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        paddingRight: 12,
    },
    imagem: { width: 64, height: 64 },
    info: { flex: 1, justifyContent: 'center' },
    titulo: { fontSize: 16, fontWeight: '700' },

    botaoExcluir: {
        backgroundColor: '#c62828',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    botaoExcluirTexto: { color: 'white', fontWeight: '700', fontSize: 13 },
});