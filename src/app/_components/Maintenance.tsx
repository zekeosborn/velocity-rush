import { SiX } from '@icons-pack/react-simple-icons';

export default function Maintenance() {
  return (
    <div className="flex h-svh items-center justify-center bg-[url(/images/background.png)] bg-cover bg-center bg-no-repeat px-10">
      <p className="break-all text-center font-pixel-operator text-3xl font-bold uppercase text-white md:text-5xl">
        Maintenance
      </p>

      <a
        href="https://x.com/zekeosborn"
        target="_blank"
        className="absolute bottom-6 right-6 rounded-full bg-black p-2"
      >
        <SiX className="size-7 text-white" />
      </a>
    </div>
  );
}
