<script setup>
import LoginForm from "../forms/LoginForm.vue";
import Mascot from "../shared/Mascot.vue";
</script>

<template>
    <div class="flex">
        <Mascot />
        <div class="w-full lg:w-1/2 h-screen flex justify-center items-center">
            <div class="w-[80%] lg:w-[80%]">
                <div>
                    <h1 class="text-title font-bold">Login</h1>
                    <LoginForm />
                    <div class="flex justify-center gap-2">
                        <p class="text-sm font-bold">Heb je nog geen account?</p>
                        <a href="/register" class="text-sm underline">Registreer</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped></style>
