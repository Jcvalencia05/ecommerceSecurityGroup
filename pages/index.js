import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()
  if(!session){
    return (
      <div className={'bg-blue-500 w-screen h-screen flex items-center'}>
      <div className="text-center w-full">
        <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-md">Iniciar con Gmail</button>
      </div>
    </div>
    )
  }
  return (
    <div>Bienvenido {session.user.email}</div>
  );
}
