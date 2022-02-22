<!-- <template>
  <draggable class="dragArea" tag="ul" :list="tasks" :group="{ name: 'g1' }">
    
      <li v-for="el in tasks" :key="el.name">
        <p>{{ el.name }}</p>
        <nested-draggable :tasks="el.tasks" />
      </li>
  </draggable>
</template> -->
<template>
  <draggable
    :list="tasks"
    item-key="name"
    class="list-group dragArea"
    ghost-class="ghost"
    :group="{ name: 'g1' }"
    tag="ul"

  >
    <template #item="{ element }">
      <li class="list-group-item">
        <p class="select-none cursor-pointer">
          {{ element.name }}
        </p>
        <div>
          Content
        </div>
        <nested-draggable class="ml-5" :tasks="element.tasks" item-key="name" />
        <!-- <nested-draggable
          v-if="element.tasks.length"
          class="ml-5"
          :tasks="element.tasks"
          item-key="name"
        />
        <nested-draggable
          v-else-if="onDrag"
          class="ml-5"
          :tasks="element.tasks"
          item-key="name"
        /> -->
      </li>
    </template>
  </draggable>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  props: {
    tasks: [] as any,
  },
  components: {
    draggable,
  },

  name: "nested-draggable",
  data() {
    return {
      onDrag: false,
    };
  },
});
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  min-width: 200px;
  outline: 1px solid;
}

.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}
</style>
