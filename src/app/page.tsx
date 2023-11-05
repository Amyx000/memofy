import Home from "@/components/Home/Home";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="p-[30px] bg-light text-dark dark:bg-dark dark:text-light min-h-[100svh] flex flex-col">
      <Home />
    </main>
  );
}
