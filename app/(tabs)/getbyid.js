import { useState } from 'react'
import { View, Text, Image, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

require('dotenv').config();

const API_KEY = process.env.API_KEY;

/* resumo do codigo ele cria o get e ai quando o usuario digita um id ele subistitui o valor do id no caminho do get , é setado o id -> substitui na rota do get*/

//Basicamente faz a configuração da conexão com o servidor , evita a repetição da chamada do endereço do servidor
const api = axios.create({
    baseURL: 'https://api-ds.codeverse.dev.br',
    headers: {
        'x-api-key': API_KEY,
    }
});

export default function BuscarAnime() {
    //o useState armazena uma informação e atualiza a tela quando um dado muda
    //armazena o id
    const [id, setId] = useState("");
    //armazena o data do anime escolhido
    const [anime, setAnime] = useState(null);
    //mostra se ta buscando ou não
    const [buscando, setBuscando] = useState(false);
    //Seta seta se acontecer um erro
    const [erro, setErro] = useState(null);
    //Seta o estado de não encontrado
    const [naoEncontrado, setNaoEncontrado] = useState(false);


    //cria a função que busca o id
    async function buscarPorId() {
        //cria o filtro que define se caso o id fica vazio ele retorna erro
        if (!id) {
            setErro("O id não pode ficar vazio");
            return;
        }
        //fecha o teclado virtual
        Keyboard.dismiss();
        setBuscando(true);
        setErro(null);
        setNaoEncontrado(false);
        setAnime(null);

        // faz a requisição via axios de um get para buscar o anime com id referente
        try {
            const resposta = await api.get(`/api/animes/${id}`);
            setAnime(resposta.data);
        } catch (e) {
            if (e.response && e.response.status === 404) {
                setNaoEncontrado(true);
            } else {
                setErro("Não deu para achar o anime");
            };

        } finally {
            setBuscando(false);
        }
    }
    return (
    <SafeAreaView styles={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.conteudo}>
            <View style={styles.conteudo}>
                <Text style={styles.tituloPagina}>
                    Buscar Anime
                </Text>
                <Text style={styles.subtitulo}>
                    Por id
                </Text>
            </View>
            <Text style={styles.rotulo}>Id do Anime</Text>
            {/*campo de pesquisa, o onchange text ele verifica se houver mudança no texto e set o id para o valor que foi colocado*/}
            <View style={styles.campoDeBusca}>
                <TextInput
                    style={styles.campo}
                    value={id}
                    onChangeText={setId}
                    placeholder='Exemplo: 1'
                    keyboardType='numeric'
                />
                {/* ao pressinar realiza a ação de pesquisa */}
                <Pressable style={styles.botao}
                    onPress={buscarPorId}
                    disabled={buscando}
                >
                    <Text style={styles.botaoTexto}>
                        {buscando ? "..." : "Buscar anime"}
                    </Text>
                </Pressable>
            </View>
            {buscando ? <ActivityIndicator /> : null}

            {erro ? <Text>{erro}</Text> : null}

            {naoEncontrado && (
                <Text style={styles.avisoNaoEncontrado}>
                    Nenhum anime encontrado com esse id
                </Text>
            )}
            {anime && (
                <View style={styles.card}>
                    {anime.imageUrl ? (
                        <Image
                            source={{ uri: anime.imageUrl }}
                            style={styles.imagem}
                        />
                    ) : (
                        <View style={styles.imagemSemFoto}>
                            <Text style={styles.textoSemFoto}>??</Text>
                        </View>
                    )}
                    <View style={styles.info}>
                        <Text style={styles.titulo}>
                            {anime.title}
                        </Text>
                        <Text style={styles.categoria}>
                            {anime.genero} . {anime.ano}
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    </SafeAreaView>
)
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fbff",
  },

  conteudo: {
    padding: 24,
    paddingBottom: 48,
  },

  header: {
    marginBottom: 16,
  },

  tituloPagina: {
    fontSize: 24,
    fontWeight: "800",
    color: "#102542",
  },

  subtitulo: {
    fontSize: 14,
    color: "#5f6b7a",
    marginTop: 2,
  },

  rotulo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },

  campoDeBusca: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },

  campo: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
  },

  botao: {
    backgroundColor: "#1565c0",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoTexto: {
    color: "white",
    fontWeight: "700",
  },

  erro: {
    color: "#c62828",
    marginTop: 12,
  },

  avisoNaoEncontrado: {
    color: "#9a6700",
    marginTop: 16,
    fontStyle: "italic",
  },

  card: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    padding: 0,
  },

  imagem: {
    width: 100,
    height: 140,
  },

  imagemSemFoto: {
    width: 100,
    height: 140,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },

  textoSemFoto: {
    fontSize: 32,
  },

  info: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 12,
    gap: 5,
  },

  titulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#102542",
  },

  categoria: {
    fontSize: 13,
    color: "#64748b",
  },

  diretor: {
    fontSize: 13,
    color: "#475569",
  },

  nota: {
    fontSize: 14,
    fontWeight: "700",
    color: "#d97706",
  },
});
