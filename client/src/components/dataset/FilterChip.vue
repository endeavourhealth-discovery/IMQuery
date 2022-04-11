<template>
 
 <div class="chip non-selectable p-d-flex p-jc-center p-ai-center">
     <div>
 {{title}} ({{totalCount}})
     </div>
    
     
 </div>
  
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "FilterChip",
  props: ["title", "totalCount"],
});
</script>

<style scoped>

.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

div.chip {
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 3px;
    height: 40px;
    border: 1px solid transparent;
}

div.chip:hover {
    /* background-color: #eeeeee;*/  /* light beige */
     border: 1px solid #ced4da;
    background-color: #f8f9fb;
}



</style>
