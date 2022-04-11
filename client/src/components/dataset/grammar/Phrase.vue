<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// type PlaceholderType = "immutablePhrase" | "template" | "mutablePhrase";

export default defineComponent({
  name: "Placeholder",
  props: {
    placeholderType: {
      type: Object as () => "immutablePhrase" | "template" | "mutablePhrase",
      required: true,
    },
  },
  data() {
    return {};
  },
});
</script>

<style></style>






// 



// define a mixin object
const mixinA = {
  data () {
  	return {
    	text: 'foo'
    }
  },
  
  created: function () {
    this.greet()
  },
  
  methods: {
    greet: function () {
      console.log('hello from mixinA!')
    }
  }
}

const mixinB = {
	data () {
  	return {
    	text: 'bar'
    }
  },
 
  created: function () {
    this.greet()
  },
  
  methods: {
    greet: function () {
      console.log('hello from mixinB!')
    }
  }
}

let myCondition = true;
const useMixin = myCondition ? mixinA : mixinB; // !!! use grammar logic here

const MyComp = {
	template: `<div>My Comp: {{ text }}</div>`,  // !!! use vue template -> declare your grammar as a template?

  mixins: [useMixin], // !!! combine base mixins to create higher level components that display as UI template?
  
  beforeCreate () {
  	// Something like this won't work as mixins must be part of the components
    // object options on instantiation
  	/* this.$options.mixins.push(mixinB) */
  }
}


new Vue({
  el: "#app",
  
  components: {
  	MyComp
  }
})