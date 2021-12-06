<template>
  <div class="stepper-horizontal non-selectable">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="['step', isStepActive(index)]"
    >
      <div class="step-circle">
        <span>{{ index + 1 }}</span>
      </div>
      <div class="step-title">{{ item.label }}</div>
      <div class="step-bar-left"></div>
      <div class="step-bar-right"></div>

    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "Stepper",
  props: ["activeIndex", "items"],
  methods: {
    isStepActive(index: number): string {
      if (this.activeIndex === index) {
        return "active";
      } else {
        return "";
      }
    },
  },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.stepper-horizontal {
  display: table;
  width: 100%;
  margin: 0 auto;
}
.stepper-horizontal .step {
  display: table-cell;
  position: relative;
  padding: 0, 24px;
}
/* Hover  */
/* .stepper-horizontal .step:hover,
.stepper-horizontal .step:active {
  background-color: rgba(0, 0, 0, 0.04);
} */
.stepper-horizontal .step:active {
  border-radius: 15% / 75%;
}
.stepper-horizontal .step:first-child:active {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.stepper-horizontal .step:last-child:active {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
/* .stepper-horizontal .step:hover .step-circle{
  background-color: #696868; 
}

.stepper-horizontal .step:hover .step-title {
     color: #696868;
} */

.stepper-horizontal .step:first-child .step-bar-left,
.stepper-horizontal .step:last-child .step-bar-right {
  display: none;
}
.stepper-horizontal .step .step-circle {
  width: 30px;
  height: 30px;
  margin: 0 auto;
  background-color:  #ced4da;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}
.stepper-horizontal.green .step.active .step-circle {
  background-color: #00ae4d;
}
.stepper-horizontal.orange .step.active .step-circle {
  background-color: #f96302;
}
.stepper-horizontal .step.active .step-circle {
  background-color: #2196f3;
}

.stepper-horizontal .step.done .step-circle *,
.stepper-horizontal .step.editable .step-circle * {
  display: none;
}
.stepper-horizontal .step.editable .step-circle {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.stepper-horizontal .step .step-title {
  margin-top: 4px;
  font-size: 16px;
   font-weight: bold;
}
.stepper-horizontal .step .step-title,
.stepper-horizontal .step .step-optional {
  text-align: center;
  color: rgba(0, 0, 0, 0.26);
}




.stepper-horizontal .step.active .step-title {
   font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
}
/* .stepper-horizontal .step.active.done .step-title,
.stepper-horizontal .step.active.editable .step-title {
  font-weight: 600;
} */
/* for optional labels as subtext  */
.stepper-horizontal .step .step-optional {
  font-size: 12px;
}
/* for optional labels as subtext  */
.stepper-horizontal .step.active .step-optional {
  color: rgba(0, 0, 0, 0.54);
}
.stepper-horizontal .step .step-bar-left,
.stepper-horizontal .step .step-bar-right {
  position: absolute;
  top: 14px;
  height: 1px;
  border-top: 2px solid #dddddd;
}
.stepper-horizontal .step .step-bar-right {
  right: 0;
  left: 50%;
  margin-left: 20px;
}
.stepper-horizontal .step .step-bar-left {
  left: 0;
  right: 50%;
  margin-right: 20px;
}
</style>
