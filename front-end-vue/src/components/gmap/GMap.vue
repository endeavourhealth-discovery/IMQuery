<template>
  <div id="uprn-map" ref="mapDivRef"></div>
</template>

<script>
import { defineComponent } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

export default defineComponent({
  name: "GMap",
  props: ["zoom", "mapType", "disableUI", "pin"],
  watch: {
    pin(newValue) {
      if (this.marker != null) {
        this.marker.setMap(null);
      }

      if (newValue) {
        let latlong = newValue || { lat: 53.6242957, lng: -1.8826361 };
        this.map.setCenter(latlong);
        this.marker = new window.google.maps.Marker({
          position: latlong,
          map: this.map
        });
        this.infowindow = new window.google.maps.InfoWindow({
          content: newValue.info
        });
        this.infowindow.open(this.map, this.marker);
      }
    }
  },
  data() {
    return {
      infowindow: null,
      map: null,
      marker: null,
      infoWindow: null
    };
  },
  async mounted() {
    const loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLEMAPS_KEY
    });

    await loader.load().then(() => {
      this.map = new window.google.maps.Map(
        document.getElementById("uprn-map"),
        {
          mapTypeId: this.mapType || "hybrid",
          center: { lat: this.pin.lat, lng: this.pin.lng },
          zoom: this.zoom,
          disableDefaultUI: this.disableUI
        }
      );
    });
  }
});
</script>

<style lang="css" scoped>
#uprn-map {
  width: 100%;
  height: 100%;
  background-color: azure;
}
</style>
