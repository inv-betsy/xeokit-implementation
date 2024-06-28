<script setup lang="ts">
import { onMounted, onUnmounted, ref, defineProps, watch } from "vue";

import {
  NavCubePlugin,
  TreeViewPlugin,
  Viewer,
  XKTLoaderPlugin,
} from "@xeokit/xeokit-sdk";
import renderService from "../treeviewRenderService";

// const props = defineProps<{
//   searchQuery: string;
// }>();

const props = defineProps<{
  fileUrl: string | null;
}>();

// Reactive reference for the XKT model URL
const xktURL = ref<string>("");

// Refs for DOM elements
const mainCanvas = ref<HTMLCanvasElement>();
const cubeCanvas = ref<HTMLCanvasElement>();
const treeContainer = ref<HTMLDivElement>();

// Ref for the Viewer instance
const viewer = ref<Viewer | null>(null);

// Reference to the current scene model
let sceneModel: any = null;

// Function to load the scene model dynamically
const loadSceneModel = () => {
  console.log("Loading scene model",xktURL.value)
  if (!viewer.value || !xktURL.value) return; // Exit if viewer or xktURL is not ready

  const xktLoader = new XKTLoaderPlugin(viewer.value);

  // Unload previous scene model if exists
  if (sceneModel) {
    sceneModel.destroy();
    sceneModel = null; // Clear reference
  }

  // Load new scene model
  sceneModel = xktLoader.load({
    id: "Widget",
    src: xktURL.value,
    edges: true,
    excludeUnclassifiedObjects: false,
  });

  const t0 = performance.now();
  sceneModel.on("loaded", function () {
    const t1 = performance.now();
    console.log(
      `Model loaded in ${(t1 - t0) / 1000.0} seconds, Objects: ${
        sceneModel.numEntities
      }`
    );
  });
};

// Watch for changes in props.fileUrl and update xktURL accordingly
watch(
  () => props.fileUrl,
  (newQuery) => {
    console.log(`Search Query: ${newQuery}`);
    xktURL.value = newQuery;
    loadSceneModel(); // Call loadSceneModel whenever fileUrl changes
  }
);

onMounted(() => {
  // Initialize Viewer instance on mount
  viewer.value = new Viewer({
    canvasElement: mainCanvas.value,
    transparent: true,
  });

  // Configure camera and plugins
  const cameraControl = viewer.value.cameraControl;
  const scene = viewer.value.scene;
  const cameraFlight = viewer.value.cameraFlight;

  cameraControl.followPointer = true;
  cameraFlight.duration = 1.0;
  cameraFlight.fitFOV = 25;

  scene.camera.eye = [-37.1356047775136, 13.019223731456176, 58.51748229729708];
  scene.camera.look = [
    -21.930914776596467, 1.3515918520952024, 29.454670463302506,
  ];
  scene.camera.up = [
    0.15536164462465452, 0.9421651211030125, -0.2969640448883814,
  ];

  // Initialize NavCubePlugin
  new NavCubePlugin(viewer.value, {
    canvasElement: cubeCanvas.value,
    visible: true,
  });

  // Initialize TreeViewPlugin
  new TreeViewPlugin(viewer.value, {
    containerElement: treeContainer.value,
    hierarchy: "containment",
    autoExpandDepth: 3,
    renderService: renderService,
  });

  // Load initial scene model if fileUrl is initially set
  if (props.fileUrl) {
    loadSceneModel();
  }
});

onUnmounted(() => {
  // Cleanup on unmount
  if (sceneModel) {
    sceneModel.destroy();
    sceneModel = null; // Clear reference
  }
  if (viewer.value !== null) viewer.value.destroy();
});
</script>

<template>
  <v-navigation-drawer width="450">
    <nav class="treeViewContainer">
      <div ref="treeContainer" class="treeWrapper" />
    </nav>
  </v-navigation-drawer>

  <v-main class="d-flex">
    <canvas ref="mainCanvas" class="viewer" />
    <canvas ref="cubeCanvas" class="navCube" />
  </v-main>
</template>
