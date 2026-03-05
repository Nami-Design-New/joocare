import { registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// register plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);