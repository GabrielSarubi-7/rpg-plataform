interface Props {
  image?: string;
}

export default function MapBackground({ image }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.8
      }}
    />
  );
}