import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import PostService from "../../services/PostService";
import SwapService from "../../services/SwapService";
import AuthService from "../../services/auth.services";
import SimpleReactLightbox from "simple-react-lightbox";
import { testScript } from "../../js/script";

import EditPostComponent from "./EditPostComponent";

import Layout from "../LayoutComponent";

import PostComponent from "../post/PostComponent";
import Popup from "reactjs-popup";

function PostTextBoxComponent() {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext);

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null);

  const [showComp, setShowComp] = useState("newsfeed");

  const [posts, setPosts] = useState([]);
  const [postsForUser, setPostsForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);

  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [files, setFiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);
  const [swapContent, setSwapContent] = useState("");
  const [swapImage, setSwapImage] = useState({});
  const [showSwapImage, setShowSwapImage] = useState(false);

  const [uploadError, setUploadError] = useState("");

  const [editPostId, setEditPostId] = useState(null);

  const [img, setImage] = useState("");
  const [Privacy, setPrivacy] = useState("");

  // const [cursorPosition, setCursorPosition] = useState();
  // const pickEmoji = (e, {emoji}) => {
  //   const ref = inputRef.current;
  //   ref.focus();
  //   const start = commentContent.substring(0, ref.seletionStart);
  //   const end = commentContent.substring(ref.selectionStart);
  //   const text = start + emoji + end;
  //   setCommentContent(text)
  //   setCursorPosition(start.length+emoji.length)
  // }

  // useEffect(() => {
  //   inputRef.current.selectionEnd = cursorPosition;
  // },[cursorPosition])

  const getPost = async () => {
    await PostService.getPost().then((res) => {
      setPosts(res.data);
    });
  };

  const getPostForUser = async () => {
    await PostService.getPostForUser(
      AuthService.getCurrentUser().username
    ).then((res) => {
      const uniquePost = Array.from(new Set(res.data.map((a) => a.id))).map(
        (id) => {
          return res.data.find((a) => a.id === id);
        }
      );
      setPostsForUser(uniquePost);
    });
  };

  const getSavedPost = async () => {
    await PostService.getSavedPostForUser(
      AuthService.getCurrentUser().username
    ).then((res) => {
      setSavedPost(res.data);
    });
  };

  const handlePostContent = (event) => {
    console.log(event.target.value);
    setPostContent(event.target.value);
  };

  const handleDeletePost = (postid) => {
    PostService.deletePost(postid).then((res) => {
      console.log(res.status);
      setRefresh(res.data);
      // window.location.reload();
    });
  };

  const handleCommentContent = (event) => {
    console.log(event.target.value);
    setCommentContent(event.target.value);
  };

  const handlePostingComment = (postid) => {
    if (commentContent === "") {
      return null;
    }
    const comment = { content: commentContent };
    PostService.addComment(user.id, postid, comment).then((res) => {
      console.log(res.status);
      setRefresh(res.data);
      setCommentContent("");
    });
  };

  const handleEditPost = (id) => {
    setEditPostId(id);
  };

  const handleFile = (event) => {
    console.log(event.target.files[0]);
    setFiles(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImage(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowPostImage(true);
  };

  const handleRemoveImage = () => {
    setFiles({});
    setShowPostImage(false);
  };

  const handleEditingSave = (value) => {
    setEditPostId(value);
    // console.log(res.status)
    // window.location.reload();
  };

  const checkIfLiked = (post) => {
    // maybe this is more effecient
    // post.reactions.map(r => {
    //   console.log(JSON.stringify(r.user))
    //   if(r.user.id === user.id){
    //     return true
    //   }else{
    //     return false
    //   }
    // })
    const result = post.reactions.filter(
      (reaction) => reaction.user.id == userR.id
    );
    if (result.length > 0) {
      return true;
    }
    return false;
  };

  const checkIfSaved = (post) => {
    console.log(post.savedByUsers);
    // maybe this is more effecient
    // post.savedByUsers.map(r => {
    //   console.log("runninggg")
    //   console.log(JSON.stringify(r.user) + " i p pp p p")
    // if(r.user.id === user.id){
    //   return true
    // }else{
    //   return false
    // }
    // })
    console.log(post.savedByUsers.length + " yaa");
    const result = post.savedByUsers.filter((userz) => userz.id == user.id);
    if (result.length > 0) {
      console.log(" FOUND");
      return true;
    }
    console.log(" Not found");
    return false;
  };

  const handleDeleteComment = (commentid) => {
    PostService.deleteComment(commentid).then((res) => {
      console.log(res.status);
      setRefresh(res.data);
    });
  };

  const getCommentCounter = (comments) => {
    let counter = 0;
    comments.map((comment) => {
      counter += comment.replies.length + 1;
    });
    return counter;
  };

  const uploadPost = (event) => {
    event.preventDefault();
    setUploadError("");
    console.log("uploading post working");
    if (
      postContent === "" &&
      Object.keys(files).length === 0 &&
      files.constructor === Object
    ) {
      console.log("cant be null");
      setUploadError("Please Insert A Text or an Image");
      return;
    }

    const formData = new FormData();
    formData.append("content", postContent);
    console.log(" this is the files" + files);
    formData.append(`files`, files);
    PostService.createPost(user.id, formData).then((res) => {
      console.log(JSON.stringify(res));
      setPostContent("");
      handleRemoveImage();
      setRefresh(res.data);
    });
  };

  const handleLikePost = async (post_id) => {
    UserService.likePost(user.id, post_id).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleSavePost = async (post_id) => {
    UserService.savePost(user.id, post_id).then((res) => {
      setRefresh(res.data);
    });
  };

  const getUser = async () => {
    if (user === null) {
      console.log("RUNNING");
      await UserService.getUserByEmail(
        AuthService.getCurrentUser().username
      ).then((res) => {
        setUserR(res.data);
      });
    } else {
      console.log("WALKING" + JSON.stringify(user));
      setUserR(user);
    }
  };
  const handlePrivacy = (event) => {
    console.log(event.target.value);
    setPrivacy(event.target.value);
  };
  //Swap functions

  const handleSwapContent = (event) => {
    console.log(event.target.value);
    setSwapContent(event.target.value);
  };
  const handleFileSwap = (event) => {
    console.log(event.target.files[0]);
    setFiles(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSwapImage(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowSwapImage(true);
  };
  const handleRemoveImageSwap = () => {
    setFiles({});
    setShowSwapImage(false);
  };
  const uploadSwap = (event) => {
    event.preventDefault();
    setUploadError("");
    console.log("uploading post working");
    if (
      swapContent === "" &&
      Object.keys(files).length === 0 &&
      files.constructor === Object
    ) {
      console.log("cant be null");
      setUploadError("Please Insert A Text or an Image");
      return;
    }

    const formData = new FormData();
    formData.append("content", swapContent);
    console.log(" this is the files" + files);
    formData.append(`files`, files);
    SwapService.createSwap(user.id, formData).then((res) => {
      console.log(JSON.stringify(res));
      setSwapContent("");
      handleRemoveImage();
      setRefresh(res.data);
    });
  };
  const testFanc = (post) => {
    return <PostComponent post={post} setRefresh={setRefresh} />;
  };

  const show = () => {
    if (showComp === "newsfeed") {
      return (
        <div className="loadMore">
          {postsForUser.map((post) => (
            <div key={post.id}>
              {post.group
                ? post.group.members.some(
                    (member) =>
                      member.email === AuthService.getCurrentUser().username
                  )
                  ? testFanc(post)
                  : null
                : testFanc(post)}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="loadMore">
          {savedPost.map((post) => (
            <div key={post.id}>
              {post.group
                ? post.group.members.some(
                    (member) =>
                      member.email === AuthService.getCurrentUser().username
                  )
                  ? testFanc(post)
                  : null
                : testFanc(post)}
            </div>
          ))}
        </div>
      );
    }
  };

  useEffect(() => {
    getUser();
    getPost().then(() => {
      setIsLoading(false);
    });
    getPostForUser();
    getSavedPost();
    testScript();
  }, [editPostId, refresh]);

  useEffect(() => {
    getPostForUser();
    getSavedPost();
    testScript();
  }, [user]);

  if (isLoading) {
    return <div>Loading... Please Wait</div>;
  }

  const imageshow = () => {
    return (
      <div
        style={{
          margin: "0 11px",
          padding: "15px",
          boxShadow: "0 0 3px rgb(0 0 0 / 16%)",
          borderRadius: "5px",
        }}
      >
        <div style={{ display: "inline" }}>What's in hang?</div>

        <div className="add-smilespopup">
          <label className="fileContainer">
            <i class="lar la-file-image"></i>{" "}
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
          </label>
        </div>
        <div className="gifpopup">
          <label className="fileContainer">
            <i class="las la-user-tag"></i>{" "}
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
          </label>
        </div>
        <div className="campopup">
          <label className="fileContainer">
            <i class="las la-map-marker-alt"></i>
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
          </label>
        </div>

        {/* <ul style={{marginLeft:'10px'}}>
        <li style={{fontSize:'12px'}}>What's in hang?</li>
        <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
      </label></li></ul>*/}
      </div>
    );
  };
  const imageshowPost = () => {
    return (
      <div
        style={{
          margin: "0 11px",
          padding: "15px",
          boxShadow: "0 0 3px rgb(0 0 0 / 16%)",
          borderRadius: "5px",
        }}
      >
        <div style={{ display: "inline" }}>Add More</div>

        <div className="add-smilespopup">
          <label className="fileContainer">
            <i class="lar la-file-image"></i>{" "}
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
          </label>
        </div>
        <div className="gifpopup">
          <label className="fileContainer">
            <i class="las la-user-tag"></i>{" "}
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
          </label>
        </div>
        <div className="campopup">
          <label className="fileContainer">
            <i class="las la-map-marker-alt"></i>
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
          </label>
        </div>

        {/* <ul style={{marginLeft:'10px'}}>
          <li style={{fontSize:'12px'}}>What's in hang?</li>
          <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
        </label></li></ul>*/}
      </div>
    );
  };

  const popUp = () => {
    return (
      <Popup
        trigger={
          <span style={{ cursor: "pointer" }}>
            <span style={{ marginRight: "5px" }}>
              <img
                style={{ verticalAlign: "middle" }}
                src="/assets/images/hangshare.svg"
                alt="img"
              />
            </span>
            Hang Share
          </span>
        }
        modal
      >
        {(close) => (
          <Form style={{ margin: "5px" }}>
            <div className="headpop">
              <div className="row">
                <div style={{ width: "5%" }}>
                  <a
                    href="#!"
                    style={{ padding: "10px 80px 10px 0" }}
                    onClick={close}
                  >
                    <i class="las la-times"></i>
                  </a>
                </div>
                <div
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    width: "70%",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <span>Today to me, Tomorrow to you</span>
                </div>
                <div style={{ width: "25%" }}>
                  <a className="popup-btn" href="/HangGift">
                    Keep Hang
                  </a>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 11px 11px 11px" }}>
              <div className="popupimg">
                <img
                  src={
                    user ? user.profilePicturePath : userR.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
                <div style={{ float: "left", display: "inline" }}>
                  <span>{`${user.firstName} ${user.lastName}`}</span>
                  <span style={{ display: "block", fontSize: "12px" }}>
                    <div className="dropdown">
                      <select
                        name="privacy"
                        id="privacy"
                        value={Privacy}
                        onChange={handlePrivacy}
                      >
                        <option value="Friends">Friends</option>
                        <option value="Public">Public</option>
                        <option value="Only Me">Only Me</option>
                      </select>
                    </div>{" "}
                  </span>
                </div>{" "}
              </div>{" "}
            </div>
            <div style={{ margin: "0 0 100px 11px" }}>
              <span className="textPop">
                <textarea
                  className="textpopup"
                  rows={2}
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="post_content"
                  value={postContent}
                  onChange={handlePostContent}
                />
                {showPostImage ? (
                  <>
                    <img
                      id="preview"
                      src={postImage}
                      style={{ width: "30%", objectFit: "cover" }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        right: "25px",
                        position: "absolute",
                        borderRadius: "100%",
                        background: "#b7b7b738",
                        padding: "10px 10px",
                      }}
                    >
                      <i class="las la-times"></i>
                    </button>
                  </>
                ) : null}
              </span>
              {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}
            </div>

            {imageshow()}
            <div
              style={{
                textAlign: "center",
                background: "#C4C4C4",
                fontWeight: "bold",
                color: "rgb(68 68 68)",
                margin: "11px 11px",
                padding: "15px",
                borderRadius: "5px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={uploadPost}
            >
              Post
            </div>
          </Form>
        )}
      </Popup>
    );
  };

  const postUp = () => {
    return (
      <Popup
        trigger={
          <div className="textbox">
            <span style={{ cursor: "pointer" }}>We share,do you?</span>
          </div>
        }
        modal
      >
        {(close) => (
          <Form>
            <div className="headpop">
              <div className="row">
                <div style={{ width: "5%" }}>
                  <a href="#!" onClick={close}>
                    <i class="las la-times"></i>
                  </a>
                </div>
                <div
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    width: "95%",
                    textAlign: "center",
                  }}
                >
                  <span>We share, do you?</span>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 11px 11px 11px" }}>
              <div className="popupimg">
                <img
                  src={
                    user ? user.profilePicturePath : userR.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
                <div style={{ float: "left", display: "inline" }}>
                  <span
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >{`${user.firstName} ${user.lastName}`}</span>
                  <span style={{ display: "block", fontSize: "12px" }}>
                    <div className="dropdown">
                      <select
                        name="privacy"
                        id="privacy"
                        value={Privacy}
                        onChange={handlePrivacy}
                      >
                        <option value="Friends">Friends</option>
                        <option value="Public">Public</option>
                        <option value="Only Me">Only Me</option>
                      </select>
                    </div>{" "}
                  </span>
                </div>{" "}
              </div>{" "}
            </div>
            <div style={{ margin: "0 11px 100px 11px" }}>
              <span className="textPop">
                <textarea
                  className="textpopup"
                  rows={2}
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="post_content"
                  value={postContent}
                  onChange={handlePostContent}
                />
                {showPostImage ? (
                  <>
                    <img
                      id="preview"
                      src={postImage}
                      style={{ width: "30%" }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        right: "20px",
                        position: "absolute",
                        borderRadius: "100%",
                        background: "#b7b7b738",
                        padding: "10px 10px",
                      }}
                    >
                      <i class="las la-times"></i>
                    </button>
                  </>
                ) : null}
              </span>
            </div>

            {imageshowPost()}
            <div
              style={{
                textAlign: "center",
                background: "#C4C4C4",
                fontWeight: "bold",
                color: "rgb(68 68 68)",
                margin: "11px 11px",
                padding: "15px",
                borderRadius: "5px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={uploadPost}
            >
              Post
            </div>
          </Form>
        )}
      </Popup>
    );
  };

  const shareUp = () => {
    return (
      <Popup
        trigger={
          <span style={{ cursor: "pointer" }}>
            <img
              style={{ verticalAlign: "middle" }}
              src="/assets/images/share-2.png"
              alt="img"
            />
            Share Up
          </span>
        }
        modal
      >
        {(close) => (
          <Form>
            <div className="headpop">
              <div style={{ padding: "10px" }}>
                <span>
                  <a
                    href="#!"
                    style={{ padding: "10px 150px 10px 0" }}
                    onClick={close}
                  >
                    <i class="las la-times"></i>
                  </a>
                </span>
                <span
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Share up
                </span>
                <span style={{ float: "right" }}>
                  {" "}
                  <button
                    style={{ float: "right", borderRadius: "20px" }}
                    type="submit"
                    onClick={uploadPost}
                  >
                    Post
                  </button>
                </span>
              </div>
            </div>

            <div style={{ padding: "0 11px 11px 11px" }}>
              {" "}
              <div className="popupimg">
                <img
                  src={
                    user ? user.profilePicturePath : userR.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
                <div style={{ float: "left", display: "inline" }}>
                  <span
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >{`${user.firstName} ${user.lastName}`}</span>
                  <span style={{ display: "block", fontSize: "12px" }}>
                    <div className="dropdown">
                      <select
                        name="privacy"
                        id="privacy"
                        value={Privacy}
                        onChange={handlePrivacy}
                      >
                        <option value="Friends">Friends</option>
                        <option value="Public">Public</option>
                        <option value="Only Me">Only Me</option>
                      </select>
                    </div>{" "}
                  </span>
                </div>{" "}
              </div>{" "}
            </div>
            <div style={{ margin: "0 11px 100px 11px" }}>
              <span className="textPop">
                <textarea
                  className="textpopup"
                  rows={2}
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="post_content"
                  value={postContent}
                  onChange={handlePostContent}
                />
                {showPostImage ? (
                  <>
                    <img
                      id="preview"
                      src={postImage}
                      style={{ width: "30%" }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        right: "20px",
                        position: "absolute",
                        borderRadius: "100%",
                        background: "#b7b7b738",
                        padding: "10px 10px",
                      }}
                    >
                      <i class="las la-times"></i>
                    </button>
                  </>
                ) : null}
              </span>
            </div>

            {imageshowPost()}
            <div
              style={{
                textAlign: "center",
                background: "#C4C4C4",
                fontWeight: "bold",
                color: "rgb(68 68 68)",
                margin: "11px 11px",
                padding: "15px",
                borderRadius: "5px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={uploadPost}
            >
              Post
            </div>
          </Form>
        )}
      </Popup>
    );
  };
  const swapUp = () => {
    return (
      <Popup
        trigger={
          <span style={{ cursor: "pointer" }}>
            <i class="las la-sync"></i>
            <span>Swap</span>
          </span>
        }
        modal
      >
        {(close) => (
          <Form>
            <div className="headpop">
              <div style={{ padding: "10px" }}>
                <span>
                  <a
                    href="#!"
                    style={{ padding: "10px 150px 10px 0" }}
                    onClick={close}
                  >
                    <i class="las la-times"></i>
                  </a>
                </span>
                <span
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Let's swap
                </span>
                <span style={{ float: "right" }}>
                  {" "}
                  <button
                    style={{ float: "right", borderRadius: "20px" }}
                    type="submit"
                    onClick={uploadSwap}
                  >
                    Post
                  </button>
                </span>
              </div>
            </div>
            <div style={{ padding: "0 11px 11px 11px" }}>
              {" "}
              <div className="popupimg">
                <img
                  src={
                    user ? user.profilePicturePath : userR.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
                <div style={{ float: "left", display: "inline" }}>
                  <span
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >{`${user.firstName} ${user.lastName}`}</span>
                  <span style={{ display: "block", fontSize: "12px" }}>
                    <div className="dropdown">
                      <select
                        name="privacy"
                        id="privacy"
                        value={Privacy}
                        onChange={handlePrivacy}
                      >
                        <option value="Friends">Friends</option>
                        <option value="Public">Public</option>
                        <option value="Only Me">Only Me</option>
                      </select>
                    </div>{" "}
                  </span>
                </div>{" "}
              </div>{" "}
            </div>
            <div style={{ margin: "0 11px 0x 11px" }}>
              <span className="textPop">
                <textarea
                  className="textpopup"
                  rows={2}
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="swap_content"
                  value={swapContent}
                  onChange={handleSwapContent}
                />
                {showSwapImage ? (
                  <>
                    <img
                      id="preview"
                      src={swapImage}
                      style={{ width: "30%" }}
                    />
                    <button
                      onClick={handleRemoveImageSwap}
                      style={{
                        right: "20px",
                        position: "absolute",
                        borderRadius: "100%",
                        background: "#b7b7b738",
                        padding: "10px 10px",
                      }}
                    >
                      <i class="las la-times"></i>
                    </button>
                  </>
                ) : null}
              </span>
            </div>
            {/* <div className="popupimg"> 
                                      <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
                                         <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}</span>
                                         <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                                    <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                                      <option value="Friends">Friends</option>
                                      <option value="Public">Public</option>
                                      <option value="Only Me">Only Me</option>
                                    </select></div> </span></div> </div>  */}
            <div style={{ textAlign: "center", padding: "11px 0" }}>
              <img
                style={{ verticalAlign: "middle" }}
                src="/assets/images/swapicon.png"
                alt="img"
              />
            </div>
            <div
              style={{
                textAlign: "center",
                margin: "0 11px 11px 11px",
                fontSize: "12px",
              }}
            >
              To Swap, provide clear image of object to swap
            </div>

            {/* <label className="fileContainer"><div style={{textAlign:'center',background:'#C4C4C4',fontWeight:'bold',color:'rgb(68 68 68)', margin:'11px 11px', padding:'15px',borderRadius:'5px'}} > Let's take picture<input type="file" name="post_image" accept="image/*" onChange={handleFile}></input></div></label> */}
            <div
              style={{ textAlign: "center", width: "100%", marginTop: "50px" }}
            >
              <label className="fileContainer" style={{ width: "100%" }}>
                <button
                  style={{
                    float: "right",
                    borderRadius: "5px",
                    padding: "15px",
                    width: "100%",
                    background: "#C4C4C4",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "rgb(68 68 68)",
                    cursor: "pointer",
                  }}
                  type="submit"
                >
                  <input
                    type="file"
                    name="swap_image"
                    accept="image/*"
                    onChange={handleFileSwap}
                  ></input>
                  Let's take picture
                </button>
              </label>
            </div>
          </Form>
        )}
      </Popup>
    );
  };

  return (
    <div className="central-meta newsfeed">
      {/* <div className="new-postbox">
                <figure>
                  <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" />
                </figure>
                <div className="newpst-input">
                  <Form>
                    <textarea rows={2} placeholder={uploadError ? `${uploadError}` : "write something"} name="post_content" value={postContent} onChange={handlePostContent} />
                    {showPostImage ?
                      <>
                        <img id="preview" src={postImage} style={{ width: "20rem", height: "20rem", border: "3px solid" }} />
                        <button onClick={handleRemoveImage}>x</button>
                      </>
                      :
                      null
                    }

                    <div className="attachments">
                      <ul>
                        <li><i class="las la-music"></i> <label className="fileContainer"> <input type="file" name="post_music" />
                        </label></li>

                        <li><i class="lar la-image"></i><label className="fileContainer"> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                        </label></li>
                        <li><i class="las la-video"></i> <label className="fileContainer"> <input type="file" name="post_video" />
                        </label></li>
                        <li><i class="las la-camera"></i> <label className="fileContainer"> <input type="file" />
                        </label></li>
                        <li>
                          <button type="submit" onClick={uploadPost}>Post</button>
                        </li>
                      </ul>
                    </div>
                  </Form>
                </div>
              </div> */}
      <div className="new-postbox">
        <figure>
          <img
            src={user ? user.profilePicturePath : userR.profilePicturePath}
            alt=""
          />
        </figure>
        <div className="newpst-input">
          <Form>
            {postUp()}
            {/* <textarea rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
                    {showPostImage ?
                      <>
                        <img id="preview" src={postImage} style={{ width: "80%", border: "3px solid" }} />
                        <button onClick={handleRemoveImage}>x</button>
                      </>
                      :
                      null
                    } */}

            <div className="attachments">
              <ul>
                <li>{popUp()}</li>
                {/* <label className="fileContainer"><img src="/assets/images/share-2.png" alt="img" /><span>Share Up</span> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                        </label> */}
                <li>{shareUp()}</li>
                <li>{swapUp()}</li>
                {/* <li><i class="las la-camera"></i> <label className="fileContainer"> <input type="file" />
                        </label></li> */}
              </ul>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default PostTextBoxComponent;
