import HomePage from "./Components/HomePage";
import { cookies } from "next/headers";
export default async function Home() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;  
  return (
    <div>
      <HomePage sessionId={sessionId}/>
    </div>
  );
}