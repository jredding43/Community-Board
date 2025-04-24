import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomePage from "../components/HomePage";
import About from "../components/About"
import JobPage from "../components/JobPage"
import CreateJob from "../components/CreateJob";
import Events from "../components/Events";
import AdminPage from "../components/AdminPage";

export default function Home() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <HomePage setActivePage={setActivePage} />;
      case "jobpage":
        return <JobPage />;
      case "about":
        return <About />;
      case "createjob":
        return <CreateJob />;
      case "events":
        return <Events />;
      case "admin":
        return <AdminPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header setActivePage={setActivePage} />
      <main className="flex-grow container mx-auto px-4 py-6">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
