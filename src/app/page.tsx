import { connectToDatabase } from "@/models/dbConnect";

async function ServerAction(){
  await connectToDatabase(process.env.MONGODB_URI!)
}
export default function Home() {
  ServerAction()
  return (
    <div className="flex items-center justify-center mt-10">
      <h1 className="text-4xl" >GIT TRACKER APPLICATION</h1>
    </div>
);
}
