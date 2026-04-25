import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Font,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
  Base64UploadAdapter,
  List,
  Link,
  MediaEmbed
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface CustomEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomEditor({ value, onChange }: CustomEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value || ""}
      onChange={(_, editor) => {
        onChange(editor.getData());
      }}
      config={{
        licenseKey: "GPL",
        plugins: [
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Font,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageUpload,
          Base64UploadAdapter,
          List,
          Link,
          MediaEmbed
        ],
        toolbar: [
          "undo",
          "redo",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "imageUpload",
          "mediaEmbed",
        ],
        image: {
          toolbar: [
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
          ],
        },
        fontSize: {
          options: [9, 11, 13, "default", 17, 19, 21],
        },
        mediaEmbed: {
          previewsInData: true,
        },
      }}
    />
  );
}
