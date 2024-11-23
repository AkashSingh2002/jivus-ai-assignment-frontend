import Microphone from "./components/microphone";
import { AppProvider } from "./components/appContext"
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
  <AppProvider>
    <Navbar />
    <Microphone />
    <Footer />
  </AppProvider>
  );
};
