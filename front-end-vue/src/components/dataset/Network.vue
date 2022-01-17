<template>
  <marker
    id="arrow"
    markerUnits="strokeWidth"
    markerWidth="12"
    markerHeight="12"
    viewBox="0 0 12 12"
    refX="25"
    refY="6"
    orient="auto-start-reverse"
  >
    <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: #781c81;"></path>
  </marker>
  <div :style="{ width: svgSize.width + 'px', height: svgSize.height + 'px' }">
    <div
      class="link-text-hover"
      :style="linkTextPosition"
      v-show="linkTextVisible"
      v-text="linkTextContent"
    ></div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :width="svgSize.width"
      :height="svgSize.height"
      :style="{ 'background-color': theme.bgcolor }"
      @click="clickElement"
      @mouseover.prevent="svgMouseover"
      @mouseout="svgMouseout"
    >
      <g id="container">
        <!-- links and link-text  -->
        <g>
          <g v-for="link in links" :key="link.index">
            <!-- arrow  -->
            <defs>
              <marker
                id="arrowhead"
                class="arrow-head"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon style="fill: #b8b8b8;"  points="0 0, 5 3.5, 0 7" />
              </marker>
            </defs>

            <line
              :class="`${link[linkTypeKey]} ${link.selected} link element`"
              :stroke="theme.linkStroke"
              :stroke-width="linkWidth"
              marker-end="url(#arrowhead)" 
            ></line>
            <!-- dx dy-->
            <text
              v-if="showLinkText"
              dx="0"
              dy="0"
              class="link-text"
              :fill="theme.textFill"
              :font-size="linkTextFrontSize"
            >
              {{ link[linkTextKey] }}
            </text>
          </g>
        </g>

        <!-- node and node-text -->
        <g id="node-group">
          <g v-for="node in nodes" :key="node.index">
            <circle
              :fill="nodeColor(node[nodeTypeKey])"
              :stroke-width="highlightNodes.indexOf(node.id) == -1 ? 3 : 10"
              :stroke="
                highlightNodes.indexOf(node.id) == -1
                  ? theme.nodeStroke
                  : 'gold'
              "
              :class="
                `${node[nodeTypeKey]} ${
                  node.showText ? 'selected' : ''
                } node element`
              "
              :r="nodeSize"
            ></circle>
            <text
              v-show="true || node.showText"
              :dx="nodeSize + 5"
              dy="0"
              class="node-text"
              :fill="theme.textFill"
              :font-size="nodeTextFontSize"
            >
              {{ node[nodeTextKey] }}
            </text>
          </g>
          <g></g>
        </g>
      </g>
    </svg>
  </div>
  <!-- </div> -->
</template>

<script>
import * as d3 from "d3";

DOMTokenList.prototype.indexOf = Array.prototype.indexOf;

export default {
  name: "network",
  props: {
    nodeList: Array,
    linkList: Array,
    // node
    nodeSize: {
      type: Number,
      default: 14,
    },
    nodeTextKey: {
      type: String,
      default: "id",
    },
    nodeTypeKey: {
      type: String,
      default: "group",
    },
    nodeTextFontSize: {
      type: Number,
      default: 14,
    },
    // link
    linkWidth: {
      type: Number,
      default: 2,
    },
    showLinkText: {
      type: Boolean,
      default: false,
    },
    linkTextKey: {
      type: String,
      default: "value",
    },
    linkTypeKey: {
      type: String,
      default: "type",
    },
    linkTextFrontSize: {
      type: Number,
      default: 10,
    },
    linkDistance: {
      type: Number,
      default: 50,
    },
    // svg
    svgSize: {
      type: Object,
      default: () => {
        return {
          width: window.innerWidth - 20, //#todo use javascript for dynamic sizing
          height: window.innerHeight - 150,
        };
      },
    },
    svgTheme: {
      type: String,
      default: "light", // dark or light
    },
    bodyStrength: {
      type: Number,
      default: -150,
    },
    // others
    highlightNodes: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      selection: {
        links: [],
        nodes: [],
      },
      pinned: [], // 被订住的节点的下标
      force: null,
      zoom: d3.zoom(),
      nodeColor: d3.scaleOrdinal(d3.schemeCategory10),
      linkTextVisible: false,
      linkTextPosition: {
        top: 0,
        left: 0,
      },
      linkTextContent: "",
    };
  },
  computed: {
    nodes() {
      let nodes = this.nodeList.slice();
      let nodeIds = [];
      nodes = nodes.filter((node) => {
        if (nodeIds.indexOf(node.id) === -1) {
          nodeIds.push(node.id);
          return true;
        } else {
          return false;
        }
      });
      return nodes;
    },
    links() {
      return this.linkList;
    },
    theme() {
      if (this.svgTheme === "light") {
        return {
          bgcolor: "white",
          nodeStroke: "white",
          linkStroke: "lightgray",
          textFill: "black",
        };
      } else {
        // dark
        return {
          bgcolor: "black",
          nodeStroke: "white",
          linkStroke: "rgba(200,200,200)",
          textFill: "white",
        };
      }
    },
  },
  watch: {
    bodyStrength: function() {
      this.initData();
      this.$nextTick(function() {
        this.initDragTickZoom();
      });
    },
    linkDistance: function() {
      this.initData();
      this.$nextTick(function() {
        this.initDragTickZoom();
      });
    },
    nodes: function() {
      this.initData();
      this.$nextTick(function() {
        this.initDragTickZoom();
      });
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    this.initDragTickZoom();
  },
  methods: {
    initData() {
      this.force = d3
        .forceSimulation(this.nodes)
        .force(
          "link",
          d3
            .forceLink(this.links)
            .id((d) => d.id)
            .distance(this.linkDistance)
        )
        .force("charge", d3.forceManyBody().strength(this.bodyStrength)) //The strength of the attraction or repulsion
        .force(
          "center",
          d3.forceCenter(this.svgSize.width / 2, this.svgSize.height / 2)
        );

      // console.log(this.nodes);
    },
    initDragTickZoom() {
      d3.selectAll(".node").call(this.drag(this.force));
      this.force.on("tick", () => {
        d3.selectAll(".link")
          .data(this.links)
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
        d3.selectAll(".node")
          .data(this.nodes)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);
        d3.selectAll(".node-text")
          .data(this.nodes)
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y);
        d3.selectAll(".link-text")
          .data(this.links)
          .attr("x", (d) => (d.source.x + d.target.x) / 2)
          .attr("y", (d) => (d.source.y + d.target.y) / 2);
        d3.selectAll(null).attr("marker-end", (d) =>
          d.target.x < d.source.x ? "url(#arrow)" : ""
        );
      });

      // previous code
      // this.zoom.scaleExtent([0.1, 4]).on("zoom", this.zoomed);

      // d3.select("svg")
      //   .call(this.zoom)
      //   .on("dblclick.zoom", null);

      // my code
      // var svg = d3.select("svg").call(
      //   this.zoom().on("zoom", function(event, d) {
      //     svg.attr("transform", event.transform);
      //   })
      // );
    },
    clickLink(e) {
      this.$emit("clickLink", e, e.target.__data__);
    },
    clickNode(e) {
      if (this.pinned.length === 0) {
        this.pinnedState(e);
      } else {
        d3.selectAll(".element").style("opacity", 0.2);
        this.pinned = [];
      }
      this.$emit("clickNode", e, e.target.__data__);
    },
    clickElement(e) {
      if (e.target.tagName === "circle") {
        // darkens neighbours permanently
        // this.clickNode(e);
      } else if (e.target.tagName === "line") {
        // this.clickLink(e);
      }
    },
    svgMouseover(e) {
      if (e.target.nodeName === "circle") {
        if (this.pinned.length === 0) {
          this.selectedState(e);
        }
        this.$forceUpdate();
        this.$emit("hoverNode", e, e.target.__data__);
      } else if (e.target.nodeName === "line") {
        this.linkTextPosition = {
          left: e.clientX + "px",
          top: e.clientY - 50 + "px",
        };
        this.linkTextContent = e.target.__data__[this.linkTextKey];
        this.linkTextVisible = true;
        this.$emit("hoverLink", e, e.target.__data__);
      }
    },
    svgMouseout(e) {
      this.linkTextVisible = false;
      if (e.target.nodeName === "circle") {
        if (this.pinned.length === 0) {
          this.noSelectedState(e);
        }
        this.$forceUpdate();
      }
    },
    selectedState(e) {
      e.target.__data__.showText = true;
      e.target.classList.add("selected");
      this.selection.nodes.push(e.target.__data__);
      this.lightenNeighbour(e.target.__data__);
      d3.selectAll(".element").style("opacity", 0.2);
    },
    noSelectedState(e) {
      e.target.__data__.showText = false;
      e.target.classList.remove("selected");
      this.darkenNeighbour();
      d3.selectAll(".element").style("opacity", 1);
    },
    pinnedState(e) {
      this.pinned.push(e.target.__data__.index);
      d3.selectAll(".element").style("opacity", 0.05);
    },
    lightenNeighbour(node) {
      this.links.forEach((link) => {
        if (link.source.index === node.index) {
          link.selected = "selected";
          this.selection.links.push(link);
          this.selection.nodes.push(link.target);
          this.lightNode(link.target);
        }
        if (link.target.index === node.index) {
          link.selected = "selected";
          this.selection.links.push(link);
          this.selection.nodes.push(link.source);
          this.lightNode(link.source);
        }
      });
    },
    lightNode(selectedNode) {
      this.nodes.forEach((node) => {
        if (node.index === selectedNode.index) {
          node.showText = true;
        }
      });
    },
    darkenNeighbour() {
      this.links.forEach((link) => {
        this.selection.links.forEach((selectedLink) => {
          if (selectedLink.id === link.id) {
            link.selected = "";
          }
        });
      });
      this.nodes.forEach((node) => {
        this.selection.nodes.forEach((selectednode) => {
          if (selectednode.id === node.id) {
            node.showText = false;
          }
        });
      });

      this.selection.nodes = [];
      this.selection.links = [];
    },
    zoomed() {
      d3.select("#container").attr(
        "transform",
        "translate(" +
          d3.event.transform.x +
          "," +
          d3.event.transform.y +
          ") scale(" +
          d3.event.transform.k +
          ")"
      );
    },
    drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    },
  },
};
</script>

<style scoped>
svg {
  /* border-radius: 5px; */
}

.element {
  transition: opacity 0.5s ease;
}
.selected {
  opacity: 1 !important;
}
.node,
.link {
  cursor: pointer;
}
.link-text-hover {
  position: absolute;
  z-index: 10;
  background-color: rgba(75, 75, 75, 0.596);
  border-radius: 10px;
  color: white;
  padding: 10px;
}

.link-text {
  font-size: 12px;
}

.node-text {
  font-weight: 500;
  font-size: 13px;
}

/* vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */
</style>
