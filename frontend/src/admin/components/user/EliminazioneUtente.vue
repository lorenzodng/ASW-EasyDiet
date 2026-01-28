<script setup>
    import axios from "axios";

    const props = defineProps({
        user: { type: Object, required: true }
    });
    const emit = defineEmits(["deleted"]);

    const deleteUser = async () => {
        const conferma = confirm(`Sei sicuro di eliminare l'utente ${props.user.nome}?`);
        if (!conferma) return;

        try {
            const { data } = await axios.delete(`http://localhost:5000/admin/users/${props.user._id}`);
            if (data.status) {
                emit("deleted", props.user._id);
            } else {
                alert(data.message || "Errore eliminazione");
            }
        } catch {
            alert("Errore di connessione");
        }
    };
</script>

<template>
    <button class="icon" data-label="Elimina" @click="deleteUser">🗑️</button>
</template>

<style scoped lang="scss">
    $green-dark: #2e7d32;
    $white: #fff;

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
            background: $green-dark;
            color: $white;
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
