import { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";



const API_KEY = "cv_1VfeU3pOZVBNE_YHODnm8KHctij77rwrhKxtmTiqTOKnuv6IdlMBBnDOEwcqAp";
const api = axios.create({
    baseURL: "https://api-ds.codeverse.dev.br",
    headers: {
        "x-api-key": API_KEY,
    },
});


export default function AnimesListarScreen() {
    const [herois, setAnimes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    async function buscarHerois() {
        setCarregando(true);
        setErro(null);
        try {
            const resposta = await api.get("/api/animes", {
                params: { limit: 50 },
            });

            setAnimes(resposta.data.data);
        } catch (e) {
            setErro("Não foi possível carregar os heróis. Tenta de novo em instantes.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarHerois();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.header}>
                    <Text style={styles.tituloPagina}>Listar Animes</Text>
                    <Text style={styles.subtitulo}>GET /api/animes</Text>
                </View>

                {carregando && <ActivityIndicator style={{ marginVertical: 16 }} />}
                {erro && <Text style={styles.erro}>{erro}</Text>}

                {!carregando &&
                    herois.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
                            <View style={styles.info}>
                                <Text style={styles.titulo}>{item.title}</Text>
                                
                            </View>
                        </View>
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#020202" },
    conteudo: { padding: 24, paddingBottom: 48 },
    header: { marginBottom: 16 },
    tituloPagina: { fontSize: 24, fontWeight: "800", color: "#ffffff" },
    subtitulo: { fontSize: 14, color: "#eff1f3", marginTop: 2 },

    erro: { color: "#c62828", marginTop: 12 },
    card: {
        flexDirection: "row",
        gap: 12,
        marginTop: 12,
        backgroundColor: "#515457",
        borderRadius: 10,
        overflow: "hidden",
    },
    imagem: { width: 64, height: 64 },
    info: { flex: 1, justifyContent: "center", paddingRight: 12 },
    titulo: { fontSize: 16, fontWeight: "700" },
    categoria: { fontSize: 13, color: "#1f79f7" },
});
