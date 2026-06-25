import { getAvatarUrl } from '../../utils/getAvatarUrl';

export const AvatarRounded = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="avatar transition-transform duration-300 group-hover:scale-110">
        <div className="w-16 lg:w-20 rounded-full border-2 border-space-cyan shadow-[0_0_10px_var(--color-space-cyan)] bg-bg-main p-1">
          <img src={getAvatarUrl(name)} alt={name} className="rounded-full" />
        </div>
      </div>
      <p className="text-xs font-bold tracking-wider text-text-main drop-shadow-[0_0_5px_var(--color-text-main)] bg-bg-elevated px-4 py-1 rounded-full border border-space-border truncate max-w-full">
        {name}
      </p>
    </div>
  );
};
