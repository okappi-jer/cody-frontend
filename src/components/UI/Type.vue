<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    itemName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    selected: {
        type: String, // The name of the currently selected item
        default: ''
    },
    itemAlias: {
        type: String,
        required: true
    } 
});

const emit = defineEmits(['itemSelected']);

const isSelected = ref(props.selected === props.itemAlias);

const selectItem = () => {
    emit('itemSelected', props.itemAlias);
}

// Update isSelected whenever selected prop changes
watch(() => props.selected, (newVal) => {
    isSelected.value = newVal === props.itemAlias;
});
</script>

<template>
    <div @click="selectItem" :class="{ 'border-2 border-primary-dark': isSelected }"
        class="bg-[#FDFDFD] h-[230px] rounded-[5px] flex flex-col justify-center items-center">
        <div class="mb-[24px]">
            <img :src="imageUrl" :alt="itemName">
        </div>
        <p class="mb-[12px] text-btn">{{ itemName }}</p>
        <div class="w-[15px] h-[15px] rounded-full"
            :class="{ 'bg-primary-dark': isSelected, 'bg-offWhite-dark': !isSelected }"></div>
    </div>
</template>

<style scoped></style>
