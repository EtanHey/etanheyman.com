import Me from './components/Me';

export default function Home() {
  return (
    <div className='flex flex-col z-20 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <Me />
    </div>
  );
}
