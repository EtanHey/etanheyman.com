import Me from "./components/Me";

export default function Home() {
  return (
    <div className="z-20 flex min-h-screen w-full flex-col items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <Me />
    </div>
  );
}
