import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

function ProfilePost() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    // USE EFFECT CANNOT BE USED WITH ASYNC
    (async function fetchPosts() {
      try {
        const response = await Axios.get(`profile/${username}/posts`, {
          cancelToken: ourRequest.token,
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Problem with fetching posts.");
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    // TODO SAME ANYWHERE AXIOS GETS CALLED
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return <Post noAuthor={true} post={post} key={post._id} />;
      })}
    </div>
  );
}

export default ProfilePost;
