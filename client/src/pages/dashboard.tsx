import Navbar from "../components/navbar/navbar";
import { BookmarkForm } from "../components/forms/bookmark-form";
import BookmarksTable from "../components/data/bookmark-table";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="flex content-center justify-center mt-[11rem]">
        <BookmarkForm />
      </div>
      <div className="mt-[2rem] flex justify-center">
        <BookmarksTable />
      </div>
    </>
  );
};

export default Dashboard;
