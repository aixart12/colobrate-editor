import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
// Make sure to import the CSS for react-toastify
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer /> {/* Place ToastContainer here */}
      <Component {...pageProps} />
    </>
  );
}
