<template>
<div>
    <div class="title non-selectable">
        {{description.title}}
    </div>
    <div class="explanation non-selectable text-blue-500"  v-tooltip.bottom="description.explanation">
        <font-awesome-icon style="margin-right: 5px" icon="question-circle" />
        Need help?
    </div>
  

</div>
  
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "InputDescription",
  props: ["description"],
});
</script>

<style scoped>

.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.title {
    color: #112950;
    font-weight: bold;
    font-size: 19px;
    margin: 0 10px 5px 0;
}

.explanation {
 /* color: #2196F3; */
    font-weight: bold;
    font-size: 15px;
    margin: 0 10px 20px 0;
    display: inline-block;
}

</style>
