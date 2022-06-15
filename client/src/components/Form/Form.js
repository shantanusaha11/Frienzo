import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import FileBase from 'react-file-base64';
import {useDispatch,useSelector } from 'react-redux';
import useStyles from "./Styles";
import {createPost, updatePost} from '../../actions/Posts'
import { useHistory } from "react-router-dom";

const Form = ({currentId, setCurrentId}) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: '', selectedFile: '' });
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  );
  const user = JSON.parse(localStorage.getItem('profile'));

  const Clear = () => {
    setCurrentId(null)
    setPostData({ title: '', message: '', tags: [], selectedFile: ''})
  };  
  
  useEffect(() => {
    if (post) setPostData(post)
  }, [post]);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId === null){
      dispatch(createPost({ ...postData, name: user?.result?.name }, history));
      Clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      Clear();
    }

  };

  
  if (!user?.result?.name) {
    return(
      <Paper className={classes.paper} >
        <Typography variant="h6" align="center">
          Please Sign In to create your own post and like other's posts
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className={classes.paper}>
      <form
        autoComplete="on"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
        <TextField
          name="title"
          variant="outlined"
          label="title"
          fullWidth
          value={postData.title}
          onChange={(e)=>setPostData({...postData,title: e.target.value})}
        />
        <TextField
          name="message"
          variant="outlined"
          label="message"
          fullWidth
          value={postData.message}
          onChange={(e)=>setPostData({...postData,message: e.target.value})}
        />
        <TextField
          name="tags"
          variant="outlined"
          label="tags"
          fullWidth
          value={postData.tags}
          onChange={(e)=>setPostData({...postData,tags: e.target.value.split(',')})}
        />
        <div className={classes.fileInput}>
          <FileBase
              type="file"
              multiple={false}
              onDone={({base64})=>setPostData({...postData, selectedFile: base64})}
          />
        </div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button  variant="contained" color="secondary" size="small" onClick={Clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
