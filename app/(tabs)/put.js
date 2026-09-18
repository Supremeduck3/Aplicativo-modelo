import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const API_KEY =
    "cv_1VfeU3pOZVBNE_YHODnm8KHctij77rwrhKxtmTiqTOKnuv6IdlMBBnDOEwcqApVE";

const api = axios.create({
    baseURL: "https://api-ds.codeverse.dev.br",
    headers: {
        "x-api-key": API_KEY,
    },
});

export default function PutAnimes() {
    const [animes, setAnimes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [selecionado, setSelecionado] = useState(null);

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagemUrl, setImagemUrl] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function buscaranimes() {
        setCarregando(true);
        setErro(null);

        try {
            const resposta = await api.get("/api/animes", {
                params: { limit: 50 },
            });

            setAnimes(resposta.data.data || []);
        } catch (error) {
            console.log(error.response?.data || error.message);
            setErro("Não foi possível carregar os animes.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscaranimes();
    }, []);

    function selecionaranime(anime) {
        setSelecionado(anime);
        setTitulo(anime.title ?? "");
        setDescricao(anime.description ?? "");
        setImagemUrl(anime.imageUrl ?? "");
        setGenero(anime.genero ?? "");
    }

    async function salvarEdicao() {
        if (!titulo.trim()) {
            Alert.alert("Erro", "Preencha pelo menos o título.");
            return;
        }

        if (!selecionado?.id) {
            Alert.alert("Erro", "Nenhum anime foi selecionado.");
            return;
        }

        setSalvando(true);

        try {
            await api.put(`/api/animes/${selecionado.id}`, {
                title: titulo,
                description: descricao,
                imageUrl: imagemUrl
            });

            Alert.alert("Sucesso", "anime atualizado com sucesso!");

            setSelecionado(null);
            await buscaranimes();
        } catch (error) {
            console.log(error.response?.data || error.message);

            Alert.alert(
                "Erro",
                "Não foi possível atualizar o anime."
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.header}>
                    <Text style={styles.tituloPagina}>
                        Editar anime
                    </Text>

                    <Text style={styles.subtitulo}>
                        PUT /api/animes/:id
                    </Text>
                </View>

                {!selecionado && (
                    <>
                        <Text style={styles.instrucao}>
                            Toque em um anime para editar:
                        </Text>

                        {carregando && (
                            <ActivityIndicator
                                size="large"
                                style={{ marginVertical: 20 }}
                            />
                        )}

                        {erro && (
                            <Text style={styles.erro}>
                                {erro}
                            </Text>
                        )}

                        {!carregando &&
                            !erro &&
                            animes.map((item) => (
                                <Pressable
                                    key={item.id}
                                    style={styles.linha}
                                    onPress={() =>
                                        selecionaranime(item)
                                    }
                                >
                                    <View>
                                        <Text style={styles.linhaTitulo}>
                                            {item.title}
                                        </Text>

                                        <Text style={styles.linhaId}>
                                            ID: {item.id}
                                        </Text>
                                    </View>

                                    <Text style={styles.linhaSeta}>
                                        editar ›
                                    </Text>
                                </Pressable>
                            ))}

                        {!carregando &&
                            !erro &&
                            animes.length === 0 && (
                                <Text style={styles.semanimes}>
                                    Nenhum anime encontrado.
                                </Text>
                            )}
                    </>
                )}

                {selecionado && (
                    <>
                        <Pressable
                            onPress={() => setSelecionado(null)}
                            style={styles.voltar}
                        >
                            <Text style={styles.voltarTexto}>
                                ‹ Voltar para lista
                            </Text>
                        </Pressable>

                        <Text style={styles.editando}>
                            Editando: {titulo}
                        </Text>

                        <Text style={styles.rotulo}>
                            Título
                        </Text>

                        <TextInput
                            style={styles.campo}
                            value={titulo}
                            onChangeText={setTitulo}
                            placeholder="Ex: One punch"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.rotulo}>
                            Descrição
                        </Text>

                        <TextInput
                            style={[
                                styles.campo,
                                styles.campoGrande,
                            ]}
                            value={descricao}
                            onChangeText={setDescricao}
                            placeholder="Descrição do anime"
                            placeholderTextColor="#999"
                            multiline
                        />

                        <Text style={styles.rotulo}>
                            URL da imagem
                        </Text>

                        <TextInput
                            style={styles.campo}
                            value={imagemUrl}
                            onChangeText={setImagemUrl}
                            placeholder="https://exemplo.com/anime.jpg"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />

                        <Text style={styles.rotulo}>
                            Gênero
                        </Text>

                        <TextInput
                            style={styles.campo}
                            value={genero}
                            onChangeText={setGenero}
                            placeholder="Ex: Ação"
                            placeholderTextColor="#999"
                        />

                        <Pressable
                            style={[
                                styles.botao,
                                salvando && styles.botaoDesabilitado,
                            ]}
                            onPress={salvarEdicao}
                            disabled={salvando}
                        >
                            {salvando ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.botaoTexto}>
                                    Salvar alterações
                                </Text>
                            )}
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },

    conteudo: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        marginBottom: 25,
    },

    tituloPagina: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
    },

    subtitulo: {
        marginTop: 5,
        fontSize: 14,
        color: "#777",
    },

    instrucao: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
        color: "#333",
    },

    linha: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    linhaTitulo: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#222",
    },

    linhaId: {
        fontSize: 12,
        color: "#888",
        marginTop: 4,
    },

    linhaSeta: {
        color: "#007AFF",
        fontWeight: "600",
    },

    erro: {
        color: "#d00",
        backgroundColor: "#ffe5e5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },

    semanimes: {
        textAlign: "center",
        color: "#777",
        marginTop: 20,
    },

    voltar: {
        marginBottom: 20,
    },

    voltarTexto: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },

    editando: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },

    rotulo: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginBottom: 7,
        marginTop: 12,
    },

    campo: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: "#222",
    },

    campoGrande: {
        minHeight: 100,
        textAlignVertical: "top",
    },

    botao: {
        backgroundColor: "#007AFF",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginTop: 25,
    },

    botaoDesabilitado: {
        opacity: 0.6,
    },

    botaoTexto: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});