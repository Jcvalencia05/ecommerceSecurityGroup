import Layout from "@/components/Layout";
import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const {data: session} = useSession();
  return <Layout>
    <div className="text-black flex justify-between">
      <h2>
        Bienvenido, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-red-50 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="py-1 px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
  </Layout>
}
