/** Official Spotify embed player for a track or album. */
export function SpotifyEmbed({
  kind,
  id,
  compact = false,
}: {
  kind: "track" | "album";
  id: string;
  compact?: boolean;
}) {
  if (!id) return null;
  return (
    <iframe
      src={`https://open.spotify.com/embed/${kind}/${id}?theme=0`}
      width="100%"
      height={compact ? 152 : kind === "album" ? 352 : 152}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-xl"
      title="Spotify player"
    />
  );
}
