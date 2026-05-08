export default function VideoPlayer({ ytId, title }) {
  if (!ytId) {
    return (
      <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden bg-navy-700 border border-navy-border flex items-center justify-center">
        <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
          {title || 'TBD'}
        </span>
      </div>
    );
  }

  return (
    <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black">
      <iframe
        className="absolute inset-0 w-full h-full border-0"
        src={`https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
