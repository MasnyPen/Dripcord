import {BotStatus} from '@shared/BotStatus'

export default function Bot({ img, name, status, presence, className }: {img: string, name: string, presence: string, status: BotStatus, className?: string}) {
    const statusColor = {
    online: 'bg-green-500',
    idle: 'bg-yellow-400',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  return (
    <figure className={"flex items-center gap-3 text-sm text-white bg-gray-700 rounded-2xl p-2 font-medium select-none " + className}>
      <div className="relative w-10 h-10 shrink-0">
        <img
          src={img}
          alt={`${name} avatar`}
          className="w-full h-full rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-700 ${statusColor[status]}`}
        />
      </div>

      <figcaption className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-blue-500 font-semibold">{name}</span>
        </div>
        <span className="text-gray-400">{presence}</span>
      </figcaption>
    </figure>
  );
}