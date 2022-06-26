import vue from "@vitejs/plugin-vue";

export default {
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: "//localhost:8088/",
        },
      },
    }),
  ],
};
