<template>
  <button
    :class="
      `non-selectable transition duration-300 ease-in-out flex items-center justify-center rounded-md border border-transparent border-${borderColor} bg-${backgroundColor} hover:bg-${hoverBackgroundColor} hover:text-${hoverTextColor} text-${textColor} focus:bg-${hoverBackgroundColor} focus:text-${focusTextColor} focus:ring-${ringColor}` +
      [ rounded ? ' rounded': '' ] +
      [ showRing ? ' focus:outline-none focus:ring-2 focus:ring-offset-2' :'' ]
    "
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "RoundButton",
  props: [
    "rounded",
    "showRing",
    "backgroundColor",
    "borderColor",
    "hoverBackgroundColor",
    "textColor",
    "focusTextColor",
    "ringColor",
    "hoverTextColor"
  ],
  emits: ["click"],
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.rounded {
  border-radius: 50%;
}
</style>
