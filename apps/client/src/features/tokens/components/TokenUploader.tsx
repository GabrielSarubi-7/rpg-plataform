import { useRef } from "react";

export default function TokenUploader({ onUpload }: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onUpload(url);
  };

  return (
    <>
      <button onClick={() => inputRef.current?.click()}>
        Trocar imagem
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </>
  );
}