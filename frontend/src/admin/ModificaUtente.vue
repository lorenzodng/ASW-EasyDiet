<script setup>
    import { ref } from "vue";
    import axios from "axios";

    const props = defineProps({
        user: { type: Object, required: true }
    });
    const emit = defineEmits(["updated"]);

    const isEditing = ref(false);
    const editEmail = ref("");

    // quando clicco "✏️"
    const editUser = () => {
        editEmail.value = props.user.email; // prende email dal padre
        isEditing.value = true;
    };

    // annulla modifica
    const cancelEdit = () => {
        isEditing.value = false;
        editEmail.value = "";
    };

    // salva modifica e aggiorna il padre
    const saveUser = async () => {
        try {
            const { data } = await axios.put(
                `http://localhost:5000/admin/users/${props.user._id}`,
                { email: editEmail.value }
            );

            if (data.status) {
                props.user.email = editEmail.value; // aggiorna direttamente l'email nel padre
                isEditing.value = false;
                emit("updated");
            } else {
                alert(data.message || "Errore aggiornamento");
            }
        } catch {
            alert("Errore di connessione");
        }
    };
</script>

<template>
    <div class="inline-edit">

        <template v-if="!isEditing">
            <span class="email-text">{{ user.email }}</span>
            <button class="icon" data-label="Modifica" @click="editUser">✏️</button>
        </template>

        <template v-else>
            <input type="email" v-model="editEmail" class="edit-input" />
            <button class="icon" data-label="Salva" @click="saveUser">💾</button>
            <button class="icon" data-label="Annulla" @click="cancelEdit">❌</button>
        </template>
    </div>
</template>

<style scoped lang="scss">
    .inline-edit {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .edit-input {
        padding: 6px 10px;
        border: 2px solid #4caf50;
        border-radius: 6px;
        font-size: 14px;
        width: 180px;

        &:focus {
            outline: none;
            border-color: #2e7d32;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
        }
    }

    .icon {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 18px;
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.2);
        }

        &::after {
            content: attr(data-label);
            position: absolute;
            bottom: 130%;
            left: 50%;
            transform: translateX(-50%);
            background: #2e7d32;
            color: #fff;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        &:hover::after {
            opacity: 1;
        }
    }
</style>
