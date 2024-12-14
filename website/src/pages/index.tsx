import { Inter } from "next/font/google";
import Tiptap from "@/components/Tiptap/Tiptap";
import TreeView from "@/components/TreeView/TreeView";
import LoginForm from "@/components/LoginForm/LoginForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <TreeView />
      <Tiptap />
      {/* <LoginForm /> */}
    </main>
  );
}
