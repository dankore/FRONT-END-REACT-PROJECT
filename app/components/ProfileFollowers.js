import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';

function ProfileFollowers(){
    const {username} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
         const ourRequest = Axios.CancelToken.source();
          // USE EFFECT CANNOT BE USED WITH ASYNC
        (async function fetchPosts(){
            try {
                const response = await Axios.get(`profile/${username}/followers`, { cancelToken: ourRequest.token });
                setPosts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log("Problem with fetching posts.")
            }
        })();
        // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    // TODO SAME ANYWHERE AXIOS GETS CALLED
    return () => {
      ourRequest.cancel();
    }
    }, [username])

    if(isLoading) return <LoadingDotsIcon />

    return(
        <div className="list-group">
           {posts.map((follower, index) => {
               return(
                <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                    <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
                </Link>
               )
           })}
        </div>
    )
}

export default ProfileFollowers;

