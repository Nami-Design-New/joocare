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
  Heading,
  Alignment,
  Underline,
  Strikethrough,
  Code,
  RemoveFormat,
  CodeBlock,
  BlockQuote,
  HorizontalLine,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import { useTranslations } from "next-intl";

interface CustomEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomEditor({ value, onChange }: CustomEditorProps) {
  const t = useTranslations("companyPage.postJob.editor");
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
          Heading,
          Alignment,
          Underline,
          Strikethrough,
          Code,
          RemoveFormat,
          CodeBlock,
          BlockQuote,
          HorizontalLine,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageUpload,
          Base64UploadAdapter,
          List,
          Link
        ],
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "alignment",
          "|",
          "fontColor",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "removeFormat",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "link",
          "imageUpload",
          "codeBlock",
          "blockQuote",
          "horizontalLine",
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
        heading: {
          options: [
            { model: 'paragraph', title: t('normal-text'), class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: t('heading-one'), class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: t('heading-two'), class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: t('heading-three'), class: 'ck-heading_heading3' },
          ],
        },
      }}
    />
  );
}
