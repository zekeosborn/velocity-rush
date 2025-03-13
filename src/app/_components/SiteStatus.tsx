import { SiX } from '@icons-pack/react-simple-icons';

interface Props {
  status: 'maintenance' | 'pause';
}

export default function SiteStatus({ status }: Props) {
  return (
    <div className="flex h-screen items-center justify-center bg-[url(/images/background.png)] bg-cover bg-center bg-no-repeat">
      <div className="max-w-sm space-y-10 text-center text-2xl md:max-w-lg md:text-3xl lg:max-w-xl lg:text-4xl 2xl:max-w-3xl 2xl:space-y-14 2xl:text-5xl">
        {textMap[status].map((text) => (
          <p
            key={text}
            className="font-pixel-operator font-bold uppercase text-primary"
          >
            {text}
          </p>
        ))}

        <a
          href="https://x.com/zekeosborn"
          target="_blank"
          className="inline-block rounded-full bg-black p-2 2xl:p-3"
        >
          <SiX className="size-7 text-white 2xl:size-9" />
        </a>
      </div>
    </div>
  );
}

const textMap = {
  maintenance: ['Under Maintenance!', "We'll be back soon!"],
  pause: ['Thank you for participating!', 'The game is temporarily paused.'],
};
