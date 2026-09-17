import { useState } from 'react'
import { View, Text, Image, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

const API_KEY = "cv_1VfeU3pOZVBNE_YHODnm8KHctij77rwrhKxtmTiqTOKnuv6IdlMBBnDOEwcqApVE"

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
}

return (
    <SafeAreaView>
        <ScrollView>
            <View>
                <Text>
                    Buscar Anime
                </Text>
                <Text>
                    Por id
                </Text>
            </View>
            <Text>Id do Anime</Text>
            {/*campo de pesquisa, o onchange text ele verifica se houver mudança no texto e set o id para o valor que foi colocado*/}
            <View style={StyleSheet.campoDeBusca}>
                <TextInput
                    style={StyleSheet.campo}
                    value={id}
                    onChangeText={setId}
                    placeholder='Exemplo: 1'
                    keyboardType='numeric'
                />
                {/* ao pressinar realiza a ação de pesquisa */}
                <Pressable style={StyleSheet.botao}
                    onPress={buscarPorId}
                    disabled={buscando}
                >
                    <Text>
                        {buscando ? "..." : "Buscar anime"}
                    </Text>
                </Pressable>
            </View>
            {buscando ? <ActivityIndicator /> : null}

            {erro ? <Text>{erro}</Text> : null}

            {naoEncontrado && (
                <Text>
                    Nenhum anime encontrado com esse id
                </Text>
            )}
            {filme && (
                <View>
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
                        <Text style={style.categoria}>
                            {anime.genero} . {anime.ano}
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    </SafeAreaView>
)