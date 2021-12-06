<template>
  <div>

    <input :type="type" :class="['w-100', (hasUserInteracted && !validateMinLength ? 'p-invalid' : '')]" :placeholder="placeholder" @blur="handleBlur" :value="value" :maxlength="maxlength"  @input="$emit('valueChanged', $event.target.value)"/>
    <div class="message">
      <Message v-if="hasUserInteracted && !validateMinLength" severity="error" :closable="false"
        >The minimum characters required is {{ minlength }}</Message
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "InputTextbox",
  emits: ["valueChanged"],
  props: ["type", "placeholder", "minlength", "maxlength", "value", "onInputChanged"],
  data() {
    return {
      inputValue: "",
      hasUserInteracted: false,
    };
  },
   methods: {
    handleBlur(): void {
      this.hasUserInteracted = true;
    },  
  },
  computed: {
    validateMinLength(): boolean {
       if (this.minlength) {
          return this.inputValue.trim().length >= this.minlength;    
      } else {
        return true;
      } 
    }
  }
});
</script>



<style scoped>

input {
  font-size: 1.25rem !important;
    padding: 0.625rem 0.625rem; /*for large size */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

    color: #495057;
    background: #ffffff;
    /* padding: 0.5rem 0.5rem; */ /*for default size */
        /* font-size: 1rem; */
    border: 1px solid #ced4da;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    border-radius: 3px;

    

}

input:hover {
    border-color: #2196F3;
}

input:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: 0 0 0 0.2rem #a6d5fa;
    border-color: #2196F3;
}

input.p-invalid:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: 0 0 0 0.2rem #facfcb;
    border-color: #f44336;
}

input.p-invalid {
  border-color: #f44336;
}

.w-100 {
  width: 100%;
}

.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}


</style>
