<script setup>
    import { ref, onMounted, watch, nextTick } from "vue";
    import { marked } from 'marked';

    const messages = ref([]);
    const newMessage = ref(""); // Message typed by the user
    const chatWidth = ref(560); // Chat sidebar width
    const messagesContainer = ref(null);
    const isResizing = ref(false);
    const isSending = ref(false); // Prevents sending multiple messages while waiting for the LLM response
    const formatMessage = (text) => marked.parse(text);

    const startResize = (e) => {
        isResizing.value = true;
        e.preventDefault(); // Prevent default browser behavior
    };

    const stopResize = () => {
        isResizing.value = false;
    };

    const doResize = (e) => {
        if (!isResizing.value) return;
        chatWidth.value = window.innerWidth - e.clientX;
    };

    // Send message to the backend
    const sendMessage = () => {
        if (!newMessage.value.trim() || isSending.value) return;

        messages.value.push({ role: "user", content: newMessage.value });
        newMessage.value = "";
        isSending.value = true;

        const evtSource = new EventSource("http://localhost:5000/chat?messages=" + encodeURIComponent(JSON.stringify(messages.value))); //apre una connessione in streaming con il backend

        let assistantMessage = { role: "assistant", content: "" }; // Create an empty assistant message
        messages.value.push(assistantMessage); //Push placeholder to show "Assistente:" immediately

        // Receive message tokens from the LLM
        evtSource.onmessage = (e) => {
            const data = JSON.parse(e.data);

            // Incrementally update the assistant message with streamed tokens
            messages.value[messages.value.length - 1] = {
                ...messages.value[messages.value.length - 1],
                content: messages.value[messages.value.length - 1].content + data.content
            };

            nextTick().then(() => {
                if (messagesContainer.value) {
                    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
                }
            });
        };

        // Close the streaming connection when the response is complete
        evtSource.addEventListener("end", () => {
            isSending.value = false;
            evtSource.close();
        });

        // Close the streaming connection on error
        evtSource.onerror = (err) => {
            console.error(err);
            isSending.value = false;
            evtSource.close();
        };
    };
    // Initialize the chat with a welcome message
    onMounted(() => {
        if (messages.value.length === 0) {
            messages.value.push({
                role: "assistant",
                content: "Ciao! Sono qui per aiutarti a gestire al meglio la tua alimentazione. Hai bisogno di generare una dieta, consigli su ricette o idee per i tuoi pasti? 😋"
            });
        }
        window.addEventListener("mousemove", doResize); // Calls "doResize" while the user moves the mouse
        window.addEventListener("mouseup", stopResize); // Stops resizing when the mouse is released
    });

    const emit = defineEmits(["close"]); // Define events emitted to the parent component
    const closeChat = () => emit("close"); // Emit close event
</script>

<template>
    <div class="chat-sidebar" :style="{ width: chatWidth + 'px' }">

        <div class="resizer" @mousedown="startResize"></div>

        <div class="chat-header">
            <h3>Chat</h3>
            <button @click="closeChat">✖</button>
        </div>

        <div class="chat-messages" ref="messagesContainer">
            <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.role]">
                <div class="message-content">
                    <!-- User message bubble -->
                    <span v-if="msg.role === 'user'" class="bubble user">
                        <strong>Tu:</strong>
                        <span v-html="formatMessage(msg.content)"></span>
                    </span>

                    <!-- Assistant message bubble -->
                    <span v-else class="bubble assistant">
                        <strong>Assistente:</strong>
                        <span v-html="formatMessage(msg.content)"></span>
                    </span>
                </div>
            </div>
        </div>

        <div class="chat-input">
            <textarea v-model="newMessage" placeholder="Scrivi qui..." @keydown.enter.prevent="sendMessage"
                @keydown.enter.alt.exact.stop="newMessage += '\n'"></textarea>
            <button @click="sendMessage" :disabled="isSending || !newMessage.trim()">Invia</button>
        </div>
    </div>
</template>

<style scoped lang="scss">

    $chat-bg: #f9f9f9;

    $user-bubble-bg: #cce5ff;
    $assistant-bubble-bg: #d0f1bd;

    .resizer {
        width: 5px;
        cursor: ew-resize;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
    }

    .chat-sidebar {
        position: fixed;
        top: 100px;
        right: 0;
        height: calc(100vh - 91px);
        background: $chat-bg;
        border-left: 1px solid $gray-border;
        display: flex;
        flex-direction: column;
        z-index: 2;
        min-width: 160px;
        max-width: 750px;
    }

    .chat-header {
        height: 70px;
        background: $gray-soft;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $gray-border;
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

    .user,
    .assistant {
        display: flex;
        flex-direction: column;

        &.message-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .bubble {
            max-width: 400px;
            padding: 8px 12px;
            border-radius: 12px;
            text-align: left;
            display: block;
            word-break: break-word;

            p {
                margin: 0;
                display: inline;
            }
        }
    }

    .user {
        align-items: flex-end;

        .bubble {
            background-color: $user-bubble-bg;
            border-radius: 12px;
        }
    }

    .assistant {
        align-items: flex-start;

        .bubble {
            background-color: $assistant-bubble-bg;
            margin-right: auto;
        }
    }

    .chat-input {
        display: flex;
        padding: 10px;
        border-top: 1px solid #ccc;
        margin-bottom: 10px;

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
