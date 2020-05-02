import React, { useEffect, useState, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import { useParams, Link, Redirect } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

function ViewSinglePost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false, 
    permissionProblem: false
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        if(appState.user.username != action.value.author.username){
            draft.permissionProblem = true
        }
        return;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        return;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        return;
      case "submitRequest":
        if(!draft.title.hasErrors && !draft.body.hasErrors){
            draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title.";
        }
        return;
     case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide body content.";
        }
     return;
     case "notFound":
        draft.notFound = true;
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  function submitHandler(e) {
    e.preventDefault();
    dispatch({type: "titleRules", value: state.title.value});
    dispatch({type: "bodyRules", value: state.body.value});
    dispatch({ type: "submitRequest" });
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    // USE EFFECT CANNOT BE USED WITH ASYNC
    (async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token });

        if(response.data){
            dispatch({ type: "fetchComplete", value: response.data });
        } else {
            dispatch({type: "notFound"})
        }
      } catch (error) {
        console.log("Problem from Edit post Axios.get page.");
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    // TODO SAME ANYWHERE AXIOS GETS CALLED
    return () => {
      ourRequest.cancel();
    };
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST ENDS
  }, []); // EMPTY [] MEANS REACT SHOULD RUN THE USE EFFECT ONCE, WHEN ON THE PROFILE PAGE

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      // USE EFFECT CANNOT BE USED WITH ASYNC
      const ourRequest = Axios.CancelToken.source();

      (async function fetchPost() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Post was updated." });
        } catch (error) {
          console.log("Problem from edit post Axios.post page.");
        }
      })();
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      // TODO SAME ANYWHERE AXIOS GETS CALLED
      return () => {
        ourRequest.cancel();
      };
    }
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST ENDS
  }, [state.sendCount]); // EMPTY [] MEANS REACT SHOULD RUN THE USE EFFECT ONCE, WHEN ON THE PROFILE PAGE

  // IF DB DOESNT FIND THE POST ID
  if(state.notFound){
    return(
       <NotFound />
    )
  }
  // IF NOT OWNER OF THE CURRENT POST
  if(state.permissionProblem){
    appDispatch({type: "flashMessage", value: "You do not have permission to edit this post."});
    return <Redirect to="/" />
  }
  // SHOW THIS IF DB IS TAKING TIME TO RETURN REQUEST
  if (state.isFetching) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
    <Link className="small font-weight-bold"  to={`/post/${state.id}`}>&laquo; Back to post permink</Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onBlur={(e) => dispatch({ type: "titleRules", value: e.target.value })}
            onChange={(e) => dispatch({ type: "titleChange", value: e.target.value })}
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onBlur={e=> dispatch({type: "bodyRules", value: e.target.value})}
            onChange={(e) => dispatch({ type: "bodyChange", value: e.target.value })}
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
}

export default ViewSinglePost;
