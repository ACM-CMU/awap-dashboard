import type { NextPage } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import DropZone from "@components/submissions/DropZone";
import styles from "@styles/Home.module.css";
import { AdminLayout } from '@layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDown,
  faArrowUp,
  faDownload,
  faEllipsisVertical,
  faMars,
  faSearch,
  faUsers,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import {
  Button, ButtonGroup, Card, Dropdown, ProgressBar,
} from 'react-bootstrap'
import { Bar, Line } from 'react-chartjs-2'
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import {
  faFoursquare,
  faFacebookF,
  faLinkedinIn,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import React, { useReducer } from 'react'
import axios from "axios";
import { useEffect, useState } from "react";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { FileUpload } from 'primereact/fileupload';
import { SelectParametersFilterSensitiveLog } from '@aws-sdk/client-s3';
import { UserLayout } from '@layout'
import { useSession } from 'next-auth/react'
import Router from 'next/router'

import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';

import { unstable_getServerSession } from 'next-auth/next'
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
import {
  DynamoDB,
  DynamoDBClientConfig,
  GetItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'

const config: DynamoDBClientConfig = {
  credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY as string,
      secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
  },
  region: process.env.S3_UPLOAD_REGION,
}

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
  },
})
const TableRow: React.FC<{ submission: any }> = ({ submission }) => {
  // let timeStamp = "default";
  // if(!submission.submissionURL) {
    
  // }
  return (
    <tr className="align-middle">
      <td className="text-center">
        <div className="avatar avatar-md d-inline-flex position-relative">
          <Image
            fill
            className="rounded-circle"
            src="/assets/img/avatars/1.jpg"
            alt="user@email.com"
          />
          <span
            className="avatar-status position-absolute d-block bottom-0 end-0 bg-success rounded-circle border border-white"
          />
        </div>
      </td>
      <td>
        <div><a href={submission.submissionURL} target="_blank">{submission.fileName}</a></div>
      </td>
      <td>
        <div className="clearfix">
          <div className="float-start">
            <div className="fw-semibold">30%</div>
          </div>
          <div className="float-end">

          </div>
        </div>
        <ProgressBar className="progress-thin" variant="success" now={30} />
      </td>
      {/* <td className="text-center">
        <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
      </td> */}
      <td>
        <div className="small text-black-50"></div>
        <div className="fw-semibold">{submission.timeStamp}</div>
      </td>
      <td>
        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            bsPrefix="btn"
            className="btn-link rounded-0 text-black-50 shadow-none p-0"
            id="action-user1"
          >
            <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Info</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Edit</Dropdown.Item>
            <Dropdown.Item
              className="text-danger"
              href="#/action-3"
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  )
}

const TableBody: React.FC<{ data: any }> = ({ data }) => {
  return (
    <tbody>
      {data.map((item: any) => (
        <TableRow submission={item} />
      ))}
    </tbody>
  )
}


const Submissions : NextPage = ({submission_data,}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  const [file, setFile] = useState<any>(null);
  const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);
  // const { status, data } = useSession()

  const uploadFile = async () => {
    setUploadingStatus(true);
    let time1 = new Date().toLocaleString();
    let team = "testteam2"
    let time2 = time1.split('/').join('-');
    let time = time2.split(' ').join('');
    let fileName = "bot-" + team + "-" + time + ".py";
    let { data } = await axios.post("/api/s3-upload", {
      name: fileName,
      type: file.type,
    });

    const fileUrl = data.url;
    await axios.put(fileUrl, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    await axios.post("/api/dynamo-upload", {
      uploadedName: file.name,
      team: team,
      fileName: fileName,
    });


    setUploadingStatus(false);
    setFile(null);
  };

  useEffect(() => {
    if (file) {
      const uploadedFileDetail = async () => await uploadFile();
      uploadedFileDetail();
    }
  }, [file]);

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-12">
          <Card className="mb-4">
            <Card.Header>
              Upload Submission
            </Card.Header>
            <Card.Body>
              {/* <FileUpload name="demo" url="/api/s3-upload"></FileUpload> */}
              {/* <input type="file" url="/api/s3-upload" /> */}
              <input type="file" name="image" id="selectFile" onChange={(e: any) => setFile(e.target.files[0])} />
            </Card.Body>
          </Card>

        </div>
      </div>



      <div className="row">
        <div className="col-md-12">
          <Card className="mb-4">
            <Card.Header>
              Previous Submissions
            </Card.Header>
            <Card.Body>


              <div className="table-responsive">
                <table className="table border mb-0">
                  <thead className="table-light fw-semibold">
                    <tr className="align-middle">
                      <th className="text-center">
                        <FontAwesomeIcon icon={faUsers} fixedWidth />
                      </th>
                      <th>Uploaded File Name</th>
                      <th>Elo Change</th>
                      {/* <th className="text-center">Successful</th> */}
                      <th>Time Submitted</th>
                      <th aria-label="Action" />
                    </tr>
                  </thead>
                  <TableBody data={submission_data} />
                </table>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  // if user is logged in, query match data from dynamodb index
  // TODO: Add query for user's team
  const params = {
    TableName: process.env.NEXT_AUTH_AWS_TABLE_NAME,
    KeyConditionExpression: 'TEAM_NAME = :team_name',
    ExpressionAttributeValues: {
      ':team_name': { S: "testteam2" },
    },
  }

  const command = new QueryCommand(params)
  const result = await client.send(command)
  if(!result.Items[0]){
    return {
      props: {
        submission_data: []
      }
    }

  }
  let submission_data: {
    fileName: string;
    submissionURL: any;
    timeStamp: any;
}[] = new Array(result.Items[0].PREVIOUS_SUBMISSION_URLS.SS.length);
  for (let i = 0; i < result.Items[0].PREVIOUS_SUBMISSION_URLS.SS.length; i++){
    submission_data[i] = {
      fileName: result.Items[0].UPLOADED_FILE_NAME.SS[i],
      submissionURL: result.Items[0].PREVIOUS_SUBMISSION_URLS.SS[i],
      timeStamp: result.Items[0].PREVIOUS_SUBMISSION_URLS.SS[i].slice(-21).slice(0,-3)
    }
  }
  // let submission_data = result.Items[0].PREVIOUS_SUBMISSION_URLS.SS.map((item: any) => ({
  //   fileName: "hey",
  //   submissionURL: item
  // }))

  // let submission_data = [{
  //   fileName: "defaultName",
  //   submissionURL: "defaulturl"
  // }]


  // if (result.Items) {
  //   const submission_data1 = result.Items[0];
  //   if(submission_data1){
  //     let submission_data2 = submission_data1.PREVIOUS_SUBMISSION_URLS.SS;
  //     if (submission_data2){
  //       return submission_data2.map((item: any) => ({
  //       fileName: "hey",
  //       submissionURL: item
  //     }))
  //   }
  //   }
  //   else{
  //     submission_data = []
  //   }
  // }
  // else{
  //   submission_data = []
  // }


  return {
    props: { submission_data }, // will be passed to the page component as props
  }
}
export default Submissions
