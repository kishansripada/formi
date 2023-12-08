export const exportThree = async (scene: Scene) => {
   const { USDZExporter } = await import("three/addons/exporters/USDZExporter.js");

   const exporter = new USDZExporter();
   const arraybuffer = await exporter.parse(scene);
   const blob = new Blob([arraybuffer], { type: "model/vnd.usdz+zip" });

   const url = URL.createObjectURL(blob);

   // Create an anchor element and set its href to the blob's URL
   const a = document.createElement("a");
   a.rel = "ar";
   a.href = url;
   // a.download = "scene.usdz";
   const img = document.createElement("img");
   img.src = "path_to_your_image.jpg"; // Set the image source
   img.alt = "Description of image";
   a.appendChild(img);
   // Append the anchor to the body (this is required for Firefox)
   document.body.appendChild(a);

   // Trigger a click event on the anchor
   a.click();

   // Clean up: remove the anchor and revoke the blob URL
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
};
