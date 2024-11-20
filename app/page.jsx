import Link from "next/link";
import MatchesList from "./components/MatchesList";
import UserNav from "./components/usernav";

export default function Home() {
  return (
    <div className="relative w-screen h-screen grid place-items-center bg-dodger-blue-600 font-gabarito">
      <main className="flex flex-col w-full h-screen">
        <UserNav />
        <section className="w-full h-full flex flex-col justify-center place-items-center text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white">THE GENIUS TEST</h1>
          <h2 className="max-w-80 lg:text-xl lg:max-w-96 text-dodger-blue-100">Are you a genius? You sure are! Prove it by playing now.</h2>
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
