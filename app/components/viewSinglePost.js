import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import { useParams, Link, Redirect } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Reactmarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function ViewSinglePost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const [deleteAttemptCount, SetDeleteAttemptCount] = useState(0);
  const [deleteWasSuccessful, setDeleteWasSuccessfull] = useState(false);

  useEffect(() => {
    // USE EFFECT CANNOT BE USED WITH ASYNC
    const ourRequest = Axios.CancelToken.source();

    (async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Problem from viewSinglePost page.");
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    // TODO SAME ANYWHERE AXIOS GETS CALLED
    return () => {
      ourRequest.cancel();
    };
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST ENDS
  }, [id]); // EMPTY [] MEANS REACT SHOULD RUN THE USE EFFECT ONCE, WHEN ON THE PROFILE PAGE

  useEffect(() => {
    if (deleteAttemptCount) {
      const ourRequest = Axios.CancelToken.source();
      // USE EFFECT CANNOT BE USED WITH ASYNC
      (async function deletePost() {
        try {
          const response = await Axios.delete(
            `/post/${id}`,
            {
              data: {
                token: appState.user.token,
              },
            },
            { cancelToken: ourRequest.token }
          );

          response.data == "Success" && setDeleteWasSuccessfull(true);
        } catch (error) {
          console.log("Problem from viewSinglePost page.");
        }
      })();
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      // TODO SAME ANYWHERE AXIOS GETS CALLED
      return () => {
        ourRequest.cancel();
      };
    }
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST ENDS
  }, [deleteAttemptCount]); // EMPTY [] MEANS REACT SHOULD RUN THE USE EFFECT ONCE, WHEN ON THE PROFILE PAGE

  if (deleteWasSuccessful) {
    appDispatch({ type: "flashMessage", value: "Post was successfully deleted." });
    return <Redirect to={`/profile/${appState.user.username}`} />;
  }

  // NOT FOUND PAGE
  if (!isLoading && !post) {
    return <NotFound />;
  }
  // LOADING DOTS
  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    }
    return false;
  }

  function deleteHandler() {
    const areYouSure = window.confirm("Are you sure?");
    if (areYouSure) {
      SetDeleteAttemptCount((prev) => prev + 1);
    }
  }

  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              onClick={deleteHandler}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link>{" "}
        {dateFormatted}
      </p>

      <div className="body-content">
        <Reactmarkdown
          source={post.body}
          allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]}
        />
      </div>
    </Page>
  );
}

export default ViewSinglePost;
