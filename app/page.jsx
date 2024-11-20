import Link from "next/link";
import MatchesList from "./components/MatchesList";

export default function Home() {
  return (
    <div className="relative w-screen h-screen grid place-items-center bg-dodger-blue-600 font-gabarito">
      <main className="flex flex-col w-full h-screen">
        <nav className="absolute grid place-items-center w-full h-14">
          <h3 className="font-bold">GENIUS</h3>
        </nav>
        <section className="w-full h-full flex flex-col justify-center place-items-center text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white">THE GENIUS TEST</h1>
          <h2 className="max-w-80 lg:text-xl lg:max-w-96">¿Eres un genio? Seguramente! Demuestralo jugando ahora.</h2>
          <Link href='/game'>
            <button className="grid place-items-center mt-3 px-6 h-10 bg-white text-dodger-blue-600  rounded-full">Nueva partida</button>
          </Link>
        </section>
        <footer className="absolute bottom-0 w-full px-7">
          <MatchesList />
        </footer>
      </main>
    </div>
  );
}
