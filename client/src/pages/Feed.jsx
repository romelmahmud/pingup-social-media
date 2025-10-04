import { useEffect, useState } from "react";
import { dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchFeeds = async () => {
    setFeeds(dummyPostsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);
  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* Stories and Post list */}
      <div>
        {/* stories */}
        <h1>Stories</h1>
        {/* post list */}
        <div className="p-4 space-y-6">List of posts</div>
      </div>
      {/* right sidebar */}
      <div>
        <div>
          <h2>Sponsored</h2>
        </div>
        <h2>Recent messages</h2>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
