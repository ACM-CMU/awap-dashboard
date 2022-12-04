// require("dotenv").config();
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FilePreview from "./FilePreview";
import styles from "@styles/DropZone.module.css";
import {
  DynamoDB,
  DynamoDBClientConfig,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import axios from "axios";



const DropZone = ({ data, dispatch }) => {
  // console.log(process.env.NODE_ENV);
  //console.log(Stringprocess.env.NEXT_AUTH_AWS_SECRET_KEY);
  // onDragEnter sets inDropZone to true
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  // onDragOver sets inDropZone to true
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    let files = [...e.dataTransfer.files];

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add droped file or files to fileList
      dispatch({ type: "ADD_FILE_TO_LIST", files });
      // reset inDropZone to false
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };

  // handle file selection via input element
  const handleFileSelect = (e) => {
    // get files from event on the input element as an array
    let files = [...e.target.files];

    // ensure a file or files are selected
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add selected file or files to fileList
      dispatch({ type: "ADD_FILE_TO_LIST", files });
    }
  };


  return (
    <>
      <div
        className={styles.dropzone}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <Image src="/upload.svg" alt="upload" height={50} width={50} />

        <input
          id="fileSelect"
          type="file"
          multiple
          className={styles.files}
          onChange={(e) => handleFileSelect(e)}
        />
        <label htmlFor="fileSelect"></label>

        <h3 className={styles.uploadMessage}>
          or drag &amp; drop your files here
        </h3>
      </div>
      {/* Pass the selectect or dropped files as props */}
      <FilePreview fileData={data} />
      {/* Only show upload button after selecting atleast 1 file */}
    </>
  );
};

export default DropZone;