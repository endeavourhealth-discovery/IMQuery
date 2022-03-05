    // async getAppData(): Promise<any> {
      // uses up to 5mb of localstorage of the browser
      // x-amz-version-id is Amazon S3 bucket version (feature must be enabled)
      // const isCacheSupported = "caches" in window;
      // if (isCacheSupported) {
      // const url = `${process.env.VUE_APP_ONTOLOGY_URL}/CoreOntology.json`;
      // const cacheName = "imquery-appdata";
      // create store
      // caches.open(cacheName).then((cache) => {
      //   cache.add(url).then(() => {
      //     console.log("Data cached");
      //   });
      // });
      // check response
      // caches.open(cacheName).then((cache) => {
      //   cache.match(url).then((settings: any) => {
      //     console.log(settings);
      //     fetch(settings.body)
      //       // Retrieve its body as ReadableStream
      //       .then((response) => response.body);
      //   });
      // });
      // retrieve items
      // caches.open(cacheName).then((cache) => {
      //   cache.keys().then((arrayOfRequest) => {
      //     console.log(arrayOfRequest); // [Request,  Request]
      //   });
      // });
      // } else {
      //   console.log(
      //     "Content caching is not supported in this browser. App data is fetched from CDN everytime the page is refreshed."
      //   );
      // }
      // console.log("local",, "lol"));
      // var start = Date.now();
      // await SearchService.fetchAppData()
      //   .then((res) => {
      //     // console.log("res", res);
      //     // var end = Date.now();
      //     // console.log(`Fetch time: ${end - start} ms`);
      //     return res.data;
      //   })
      //   .catch((err) => {
      //     this.$toast.add(
      //       LoggerService.error("Failed to get app data from server", err)
      //     );
      //   });
    // },