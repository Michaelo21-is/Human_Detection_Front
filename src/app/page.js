import { cookies } from "next/headers";
import HomePage from "./Components/HomePage";

async function getSeassionIdFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("seassionId")?.value;
}

export default async function Home() {
  const seassionId = await getSeassionIdFromCookie();

  return (
    <div>
      <HomePage seassionId={seassionId} />
    </div>
  );
}