<template>
  <v-app>
    <v-app-bar app color="#008c85" dark class="px-4 py-2">
      <v-app-bar-title class="ml-4">Vue, TypeScript and Xeokit</v-app-bar-title>
      <v-file-input
        v-model="tempQuery"
        label="Upload an XKT file"
        accept=".xkt"
        single-line
        hide-details
        class="mx-4"
        dense
        @change="handleFileUpload"
      ></v-file-input>
    </v-app-bar>
    <Viewer :fileUrl="fileUrl" />
  </v-app>
</template>

<script setup lang="ts">
import Viewer from "@/components/viewer.vue";
import { ref } from "vue";
import axios from "axios";

const tempQuery = ref("");
const fileUrl = ref<string | null>(null);

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<{ filePath: string }>(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fileUrl.value = response.data.filePath; // Assuming filePath is returned from backend
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
};
</script>

<style scoped>
/* Add your scoped styles here */
</style>
