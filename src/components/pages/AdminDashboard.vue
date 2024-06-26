<template>
    <div class="m-[32px] lg:m-[40px]">
        <div v-if="reviews.length > 0">
            <h2 class="text-subtitle font-bold">Gerapporteerde reviews</h2>
            <div class="mt-[24px] mb-[32px] flex gap-[32px] overflow-x-auto">
                <div v-for="(review, index) in reviews" :key="index"
                    class="bg-offWhite-light rounded-[5px] p-[24px] w-[400px]">
                    <h3 class="font-bold text-[1em] md:text-[1.2em]">{{ review.title }}</h3>
                    <p :class="{
                        'text-[0.8em]': true,
                        'md:text-body': true,
                        'mt-[12px]': true,
                        'overflow-hidden': !expandedReviews[index],
                        'line-clamp-3': !expandedReviews[index]
                    }">
                        {{ review.description }}
                    </p>
                    <span @click="toggleExpand(index)"
                        class="text-primary-dark text-[0.8em] md:text-[1em] font-bold cursor-pointer">
                        {{ expandedReviews[index] ? 'Lees minder' : 'Lees meer' }}
                    </span>
                    <div class="mt-[24px] w-full">
                        <div class="flex gap-[12px] flex-col xxxxs:flex-row">
                            <a class="h-[42px] md:h-[48px] cursor-pointer w-full bg-offWhite-light rounded-[5px] text-secondary-green border-2 border-secondary-green font-bold text-[1.1rem] md:text-btn text-center flex items-center justify-center"
                                @click="handleAcceptReview(review)">
                                <p class="relative bottom-[1px]">Accepteren</p>
                            </a>
                            <a class="h-[42px] md:h-[48px] cursor-pointer w-full bg-offWhite-light rounded-[5px] text-secondary-red border-2 border-secondary-red font-bold text-[1.1rem] md:text-btn text-center flex items-center justify-center"
                                @click="handleDeleteReview(review)">
                                <p class="relative bottom-[1px]">Verwijderen</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="unacceptedPromotors.length > 0">
            <h2 class="text-subtitle font-bold">Renovatoren verzoeken</h2>
            <div class="mt-[24px] mb-[32px] flex gap-[32px] overflow-x-auto">
                <div v-for="promotor in unacceptedPromotors" class="bg-offWhite-light rounded-[5px] p-[24px] w-[400px]">
                    <h3 class="font-bold text-[1em] md:text-[1.2em]">{{ promotor.name }}</h3>
                    <p class="text-[0.8em] md:text-body mt-[12px] overflow-hidden line-clamp-3"><span
                            class="font-bold mr-[6px]">Tier:</span>{{ promotor.tier }}</p>
                    <p class="text-[0.8em] md:text-body mt-[12px] overflow-hidden line-clamp-3"><span
                            class="font-bold mr-[6px]">Website:</span><span
                            class="text-primary-dark underline font-bold cursor-pointer" @click="navigate(promotor)">{{
                                promotor.website_url
                            }}</span></p>
                    <div class="mt-[24px] w-full">
                        <div class="flex gap-[12px] flex-col xxxxs:flex-row">
                            <a class="h-[42px] md:h-[48px] cursor-pointer w-full bg-offWhite-light rounded-[5px] text-primary-dark border-2 border-primary-dark font-bold text-[1.1rem] md:text-btn text-center flex items-center justify-center"
                                @click="goToDetails(promotor)">
                                <p class="relative bottom-[1px]">Bekijk details</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="acceptedPromotors.length > 0">
            <h2 class="text-subtitle font-bold">Geaccepteerde renovatoren</h2>
            <div class="mt-[24px] mb-[32px] flex gap-[32px] overflow-x-auto">
                <div v-for="promotor in acceptedPromotors" class="bg-offWhite-light rounded-[5px] p-[24px] w-[400px]">
                    <h3 class="font-bold text-[1em] md:text-[1.2em]">{{ promotor.name }}</h3>
                    <p class="text-[0.8em] md:text-body mt-[12px] overflow-hidden line-clamp-3"><span
                            class="font-bold mr-[6px]">Tier:</span>{{ promotor.tier }}</p>
                    <p class="text-[0.8em] md:text-body mt-[12px] overflow-hidden line-clamp-3"><span
                            class="font-bold mr-[6px]">Website:</span><span
                            class="text-primary-dark underline font-bold cursor-pointer" @click="navigate(promotor)">{{
                                promotor.website_url
                            }}</span></p>
                    <div class="mt-[24px] w-full">
                        <div class="flex gap-[12px] flex-col xxxxs:flex-row">
                            <a class="h-[42px] md:h-[48px] cursor-pointer w-full bg-offWhite-light rounded-[5px] text-primary-dark border-2 border-primary-dark font-bold text-[1.1rem] md:text-btn text-center flex items-center justify-center"
                                @click="goToDetails(promotor)">
                                <p class="relative bottom-[1px]">Bekijk details</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Confirm :showConfirm="showConfirm" title="Review verwijderen"
            desc="Weet je zeker dat je deze review wilt verwijderen?" @closeConfirm="showConfirm = false"
            @confirmAction="remove" />
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { isValidToken, getAdmin } from "../../functions/user.js";
import { getReportedReviews } from "../../functions/reviews.js";
import { deleteReview, report } from '../../functions/reviews.js';
import { getUnacceptedPromotors, getAllPromotors } from "../../functions/promotor.js";

import Confirm from "../modals/Confirm.vue";

const router = useRouter();

const showConfirm = ref(false);
const canDelete = ref(false);

const token = localStorage.getItem("token");
let adminData = ref({});

const reviews = ref([]);
let currentReview = ref({});
const unacceptedPromotors = ref([]);
const acceptedPromotors = ref([]);
const expandedReviews = ref({}); // To track expanded reviews

onMounted(async () => {
    if (isValidToken(token)) {
        adminData.value = await getAdmin(token);

        if (adminData.value !== false) {
            await getReviews();
            await getPromotors();
        } else {
            router.push('/admin/login');
        }
    } else {
        router.push("/admin/login");
    }
});

const getReviews = async () => {
    const result = await getReportedReviews();

    if (result.success) {
        reviews.value = result.data;
    }
};

const getPromotors = async () => {
    const resultUnaccepted = await getUnacceptedPromotors();

    if (resultUnaccepted.success) {
        unacceptedPromotors.value = resultUnaccepted.data;
    }

    const resultAccepted = await getAllPromotors();

    if (resultAccepted) {
        acceptedPromotors.value = resultAccepted;
    }
};

const openConfirm = () => {
    showConfirm.value = true;
};

const handleDeleteReview = async (review) => {
    openConfirm();

    if (review) {
        currentReview.value = review;
    }

    if (canDelete.value) {
        await deleteReview(currentReview.value._id);
        await getReviews();
        showConfirm.value = false;
    }
};

const handleAcceptReview = async (review) => {
    const result = await report(review._id, false);

    await getReviews();
};

const remove = async () => {
    canDelete.value = true;
    handleDelete();
};

const goToDetails = (promotor) => {
    router.push(`/admin/promotors/${promotor._id}`);
};

const navigate = (promotor) => {
    //check if promotor.website_url starts with http or https
    if (!promotor.website_url.startsWith("http://") && !promotor.website_url.startsWith("https://")) {
        window.location.href = "https://" + promotor.website_url;
    } else {
        window.location.href = promotor.website_url;
    }
};

// Method to toggle expand/collapse state
const toggleExpand = (index) => {
    expandedReviews.value[index] = !expandedReviews.value[index];
};
</script>
