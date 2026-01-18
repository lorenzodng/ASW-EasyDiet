<script setup>
    import { ref, onMounted, watch, nextTick } from "vue";
    import { marked } from 'marked';

    const messages = ref([]); //array di messaggi della chat
    const newMessage = ref(""); //messaggio nella casella di testo
    const chatWidth = ref(590); //larghezza default chat
    const messagesContainer = ref(null);
    const isResizing = ref(false);
    const isSending = ref(false); //verifica se il messaggio è arrivato dall'llm
    const formatMessage = (text) => marked.parse(text);

    //ridimensionamento chat (click premuto)
    const startResize = (e) => {
        isResizing.value = true;
        e.preventDefault(); //impedisce comportamenti predefiniti del browser
    };

    //fine ridimensionamento (rilascio click)
    const stopResize = () => {
        isResizing.value = false;
    };

    //calcola la nuova larghezza della chat
    const doResize = (e) => {
        if (!isResizing.value) return;
        chatWidth.value = window.innerWidth - e.clientX;
    };

    //invia messaggio al backend
    const sendMessage = () => {
        if (!newMessage.value.trim() || isSending.value) return;

        messages.value.push({ role: "user", content: newMessage.value });
        newMessage.value = "";
        isSending.value = true;

        const evtSource = new EventSource("http://localhost:5000/chat?messages=" + encodeURIComponent(JSON.stringify(messages.value))); //apre una connessione in streaming con il backend

        let assistantMessage = { role: "assistant", content: "" }; //costruisce un messaggio vuoto
        messages.value.push(assistantMessage); //invia un messaggio vuoto per mostrare "Assistente:" prima ancora del messaggio ricevuto

        //riceve i token (del messaggio) dall'llm
        evtSource.onmessage = (e) => {
            const data = JSON.parse(e.data);

            //aggiorna man mano il messaggio creando un nuovo oggetto per ogni token ricevuto
            messages.value[messages.value.length - 1] = {
                ...messages.value[messages.value.length - 1],
                content: messages.value[messages.value.length - 1].content + data.content
            };

            nextTick().then(() => {
                if (messagesContainer.value) { //una volta reinderizzato il token del messaggio
                    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //scrolla verso il basso
                }
            });
        };

        //chiude la sessione di streaming quando la risposta è terminata
        evtSource.addEventListener("end", () => {
            isSending.value = false;
            evtSource.close();
        });

        //chiude la sessione di streaming quando c'è un errore
        evtSource.onerror = (err) => {
            console.error(err);
            isSending.value = false;
            evtSource.close();
        };
    };

    onMounted(() => {
        if (messages.value.length === 0) {
            messages.value.push({
                role: "assistant",
                content: "Ciao! Sono qui per aiutarti a gestire al meglio la tua alimentazione. Hai bisogno di generare una dieta, consigli su ricette o idee per i tuoi pasti? 😋"
            });
        }
        window.addEventListener("mousemove", doResize); //chiama "doResize" mentre l’utente muove il mou
        window.addEventListener("mouseup", stopResize); //chiama "stopResize" quando l’utente rilascia il mouse
    });

    const emit = defineEmits(["close"]); //definisce gli eventi da emettere al genitore
    const closeChat = () => emit("close"); //funzione che emette l'evento
</script>

<template>
    <div class="chat-sidebar" :style="{ width: chatWidth + 'px' }">

        <!-- bordo di ridimensionamento -->
        <div class="resizer" @mousedown="startResize"></div>

        <!-- header della chat-->
        <div class="chat-header">
            <h3>Chat</h3>
            <button @click="closeChat">✖</button>
        </div>

        <!-- area dove vengono mostrati tutti i messaggi -->
        <div class="chat-messages" ref="messagesContainer">
            <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.role]">
                <div class="message-content">
                    <!-- Bubble utente con label interna -->
                    <span v-if="msg.role === 'user'" class="bubble user">
                        <strong>Tu:</strong> <span v-html="formatMessage(msg.content)"></span>
                    </span>

                    <!-- Bubble assistente -->
                    <span v-else class="bubble assistant">
                        <strong>Assistente:</strong> <span v-html="formatMessage(msg.content)"></span>
                    </span>
                </div>
            </div>
        </div>

        <!-- casella di input -->
        <div class="chat-input">
            <textarea v-model="newMessage" placeholder="Scrivi qui..." @keydown.enter.prevent="sendMessage"
                @keydown.enter.alt.exact.stop="newMessage += '\n'"></textarea>
            <button @click="sendMessage" :disabled="isSending || !newMessage.trim()">Invia</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .resizer {
        width: 5px;
        cursor: ew-resize;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: 1001;
    }

    .chat-sidebar {
        position: fixed;
        top: 100px;
        right: 0;
        height: calc(100vh - 91px);
        background: #f9f9f9;
        border-left: 1px solid #ccc;
        display: flex;
        flex-direction: column;
        z-index: 2;
        min-width: 200px;
        max-width: 700px;
    }

    .chat-header {
        height: 70px;
        background: #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding-left: 20px;
        padding-right: 20px;
    }

    .chat-messages {
        flex: 1;
        padding: 40px;
        overflow-y: auto;
        font-family: "Segoe UI", "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI", sans-serif;
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .message {
        display: flex;
        flex-direction: column;
    }

    .user {
        display: flex;
        flex-direction: column;
        align-items: flex-end;


        &.message-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        &.message-label {
            margin-bottom: 2px;
            margin-right: auto;
        }

        &.bubble {
            background-color: #cce5ff;
            text-align: left;
            max-width: 70%;
            padding: 8px 12px;
            border-radius: 12px;
            margin-left: auto;
            display: inline-block;

        }
    }

    .assistant {
        display: flex;
        flex-direction: column;
        align-items: flex-start;


        &.message-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        &.bubble {
            background-color: #d0f1bd;
            max-width: 70%;
            padding: 8px 12px;
            border-radius: 12px;
            text-align: left;
        }
    }

    .chat-input {
        display: flex;
        padding: 10px;
        border-top: 1px solid #ccc;


        textarea {
            flex: 1;
            padding: 5px;
            margin-right: 5px;
            min-height: 30px;
            resize: none;
            overflow-y: hidden;
            font-family: "Arial", sans-serif;
            font-size: 14px;
        }

        button {
            padding: 5px 10px;
        }
    }
</style>
