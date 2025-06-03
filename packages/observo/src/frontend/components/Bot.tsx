import {BotStatus} from '@shared/BotStatus'
import { useContext } from 'react';
import { BotContext } from '../App';

export default function Bot({ className }: {className: string}) {
    const context = useContext(BotContext);
    if (!context) throw new Error("BotContext użyty poza providerem!");
    const { bot, setBot } = context;

    const statusColor = {
    online: 'bg-green-500',
    idle: 'bg-yellow-400',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  return (
    <figure className={"flex items-center gap-3 text-sm text-white bg-gray-700 rounded-2xl p-2 font-medium select-none hover:cursor-pointer " + className} onClick={() => window.navigator.clipboard.writeText(bot.clientId)}>
      <div className="relative w-10 h-10 shrink-0">
        <img
          src={bot.img}
          alt={`${name} avatar`}
          className="w-full h-full rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-700 ${statusColor[bot.status]}`}
        />
      </div>

      <figcaption className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-blue-500 font-semibold">{bot.name}</span>
        </div>
        <span className="text-gray-400">{bot.presence}</span>
      </figcaption>
    </figure>
  );
}