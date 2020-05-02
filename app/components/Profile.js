import React, {useEffect, useContext} from 'react';
import Page from './Page';
import { useParams, Link, NavLink, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import ProfilePosts from './ProfilePosts';
import ProfileFollowers from './ProfileFollowers';
import ProfileFollowing  from './ProfileFollowing'
import {useImmer} from 'use-immer'

function Profile(){
    const { username } = useParams();
    const appState = useContext(StateContext);

    // USE THIS TO SET WHAT THE USER SEES BEFORE AXIOS GETS THE USER'S PROFILE DATA
    const [state, setState] = useImmer({
        followActionLoading: false,
        startFollowingRequestCount: 0,
        stopFollowingRequestCount: 0,
        profileData : {
        profileUsername: "...",
        profileAvatar: "https://gravatar.com/avatar/palceholder?s=128",
        isFollowing: false,
        counts: {
            postCount: "",
            followerCount: "",
            followingCount: ""
        }
    }
    })
// USE THIS TO SET WHAT THE USER SEES BEFORE AXIOS GETS THE USER'S PROFILE DATA END

    useEffect(() => { // USE EFFECT CANNOT BE USED WITH ASYNC
          const ourRequest = Axios.CancelToken.source();
       ( async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, {
                    token: appState.user.token
                },
                { cancelToken: ourRequest.token }
                )
                setState(draft => {
                    draft.profileData = response.data
                });
            } catch (error) {
                console.log("Problem from profile page.")
            }
        })();
            // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    // TODO SAME ANYWHERE AXIOS GETS CALLED
    return () => {
      ourRequest.cancel();
    }
    }, [username]); // EMPTY [] MEANS REACT SHOULD RUN THE USE EFFECT ONCE, WHEN ON THE PROFILE PAGE
   
    useEffect(() => { // USE EFFECT CANNOT BE USED WITH ASYNC
      if(state.startFollowingRequestCount){
        setState(draft => {
            draft.followActionLoading = true;
        });
        const ourRequest = Axios.CancelToken.source();
       ( async function fetchData() {
            try {
                const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, {
                    token: appState.user.token
                },
                { cancelToken: ourRequest.token }
                )
                setState(draft => {
                   draft.profileData.isFollowing = true
                   draft.profileData.counts.followerCount++;
                   draft.followActionLoading = false; // BUTTON
                });
            } catch (error) {
                console.log("Problem from profile page.")
            }
        })();
            // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    // TODO SAME ANYWHERE AXIOS GETS CALLED
    return () => {
      ourRequest.cancel();
    }
      }
    }, [state.startFollowingRequestCount]); // EMPTY [] MEANS REACT SHOULD RUN THE USE EFFECT ONCE, WHEN ON THE PROFILE PAGE


    useEffect(() => { // USE EFFECT CANNOT BE USED WITH ASYNC
      if(state.stopFollowingRequestCount){
        setState(draft => {
            draft.followActionLoading = true;
        });
        const ourRequest = Axios.CancelToken.source();
       ( async function fetchData() {
            try {
                const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, {
                    token: appState.user.token
                },
                { cancelToken: ourRequest.token }
                )
                setState(draft => {
                   draft.profileData.isFollowing = false;
                   draft.profileData.counts.followerCount--;
                   draft.followActionLoading = false; // BUTTON
                });
            } catch (error) {
                console.log("Problem from profile page.")
            }
        })();
            // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    // TODO SAME ANYWHERE AXIOS GETS CALLED
    return () => {
      ourRequest.cancel();
    }
      }
    }, [state.stopFollowingRequestCount]); // EMPTY [] MEANS REACT SHOULD RUN THE USE EFFECT ONCE, WHEN ON THE PROFILE PAGE

    function startFollowing(){
        setState(draft => {
            draft.startFollowingRequestCount++
        })
    }

    function stopFollowing(){
        setState(draft => {
            draft.stopFollowingRequestCount++
        })
    }

    return(
        <Page title="Profile Screen">
                <h2>
                    <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
                    {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
                        <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
                    )}
                    {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
                        <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">Stop Following <i className="fas fa-user-times"></i></button>
                    )}
                </h2>

                <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
                    Posts: {state.profileData.counts.postCount}
                </NavLink>
                 <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
                    Followers: {state.profileData.counts.followerCount}
                </NavLink>
                 <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
                    Following: {state.profileData.counts.followingCount}
                </NavLink>
            </div>


            <Switch>
                <Route exact path="/profile/:username">
                 {state.profileData.counts.postCount ? <ProfilePosts /> : <div>No Posts Found</div>}
                </Route>
                 <Route path="/profile/:username/followers">
                 {state.profileData.counts.followerCount ? <ProfileFollowers /> : <div>No Followers Found</div>}
                </Route>
                 <Route path="/profile/:username/following">
                 {state.profileData.counts.followingCount ? <ProfileFollowing /> : <div>Not Following Anyone</div>}
                </Route>
            </Switch>
        </Page>
    )
}

export default Profile;