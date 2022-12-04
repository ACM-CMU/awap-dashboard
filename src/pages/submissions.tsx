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
import React, { useReducer }  from 'react'
import { useState } from "react";
import axios from "axios";


Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export default function Submissions(){
    const reducer = (state, action) => {
        switch (action.type) {
          case "SET_IN_DROP_ZONE":
            return { ...state, inDropZone: action.inDropZone };
          case "ADD_FILE_TO_LIST":
            return { ...state, fileList: state.fileList.concat(action.files) };
          default:
            return state;
        }
    };
    
    
    // destructuring state and dispatch, initializing fileList to empty array
    const [data, dispatch] = useReducer(reducer, {
        inDropZone: false,
        fileList: [],
    });

    // to handle file uploads
    const uploadFile = async () => {
    // get the files from the fileList as an array
    let files = data.fileList;
    // initialize formData object
    const formData = new FormData();
    // loop over files and add to formData
    files.forEach((file) => formData.append("files", file));
    const file = files[0];
    // Upload the files as a POST request to the server using fetch
    // Note: /api/fileupload is not a real endpoint, it is just an example
    //post endpoints
    // Load the AWS SDK for Node.js
    // const postResponse = await fetch("/api/fileupload", {
    //   method: "POST",
    //   body: formData,
    // });
    // setUploadingStatus("Uploading the file to AWS S3");
    
    try {
      let { data1 } = await axios.post("/uploadComponent/uploadFile", {
      name: file.name,
      type: file.type,
    });
    }
    catch(error){
      console.log(error.response.data);
    }

    // console.log(data);

    // const url = data1.url;
    // let { data2} = await axios.put(url, file, {
    //   headers: {
    //     "Content-type": file.type,
    //     "Access-Control-Allow-Origin": "*",
    //   },
    // });

    //setUploadedFile(BUCKET_URL + file.name);
    //setFile(null);

    // console.log("hola");
    // console.log(client);
    // console.log(data);
    // await client.send(
    //   new PutItemCommand({
    //     TableName: process.env.NEXT_PUBLIC_AWS_TABLE_NAME,
    //     Item: {
    //       BOT_FILE_NAME: { S: 'newplayer' },
    //       TEAM_NAME: { S: 'player2' },
    //     },
    //   }),
    // )
    // console.log("success");
    };

    return (
        <AdminLayout>
          <div className="row">
          <div className="col-md-12">
          <Card className="mb-4">
            <Card.Header>
                Upload Submission
            </Card.Header>
            <Card.Body>
            <div className={styles.container}>
            <Head>
              <title>Upload your Submission here</title>
              <meta name="description" content="Nextjs drag and drop file upload" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
      
            <main className={styles.main}>
              <h1 className={styles.title}>Upload your Submission here: </h1>
              {/* Pass state data and dispatch to the DropZone component */}

              <DropZone data={data} dispatch={dispatch} />
              {data.fileList.length > 0 && (
                <button className={styles.uploadBtn} onClick={uploadFile}>
                  Upload
                </button>
              )}
            </main>

          </div>
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
                          <th>File Name</th>
                          <th>Submission Performance</th>
                          <th className="text-center">Successful</th>
                          <th>Date Submitted</th>
                          <th aria-label="Action" />
                        </tr>
                      </thead>
                      <tbody>
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
                            <div>Yiorgos Avraamu</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">50%</div>
                              </div>
                              <div className="float-end">
                                <small className="text-black-50">
                                  Jun 11, 2020 - Jul 10, 2020
                                </small>
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="success" now={50} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50">Last login</div>
                            <div className="fw-semibold">10 sec ago</div>
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
                        <tr className="align-middle">
                          <td className="text-center">
                            <div className="avatar avatar-md d-inline-flex position-relative">
                              <Image
                                fill
                                className="rounded-circle"
                                src="/assets/img/avatars/2.jpg"
                                alt="user@email.com"
                              />
                              <span
                                className="avatar-status position-absolute d-block bottom-0 end-0 bg-danger rounded-circle border border-white"
                              />
                            </div>
                          </td>
                          <td>
                            <div>Avram Tarasios</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">10%</div>
                              </div>
                              <div className="float-end">
                                <small className="text-black-50">
                                  Jun 11, 2020 - Jul 10, 2020
                                </small>
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="info" now={10} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50">Last login</div>
                            <div className="fw-semibold">5 minutes ago</div>
                          </td>
                          <td>
                            <Dropdown align="end">
                              <Dropdown.Toggle
                                as="button"
                                bsPrefix="btn"
                                className="btn-link rounded-0 text-black-50 shadow-none p-0"
                                id="action-user2"
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
                        <tr className="align-middle">
                          <td className="text-center">
                            <div className="avatar avatar-md d-inline-flex position-relative">
                              <Image
                                fill
                                className="rounded-circle"
                                src="/assets/img/avatars/3.jpg"
                                alt="user@email.com"
                              />
                              <span
                                className="avatar-status position-absolute d-block bottom-0 end-0 bg-warning rounded-circle border border-white"
                              />
                            </div>
                          </td>
                          <td>
                            <div>Quintin Ed</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">74%</div>
                              </div>
                              <div className="float-end">
                                <small className="text-black-50">
                                  Jun 11, 2020 - Jul 10, 2020
                                </small>
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="warning" now={74} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50">Last login</div>
                            <div className="fw-semibold">1 hour ago</div>
                          </td>
                          <td>
                            <Dropdown align="end">
                              <Dropdown.Toggle
                                as="button"
                                bsPrefix="btn"
                                className="btn-link rounded-0 text-black-50 shadow-none p-0"
                                id="action-user3"
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
                        <tr className="align-middle">
                          <td className="text-center">
                            <div className="avatar avatar-md d-inline-flex position-relative">
                              <Image
                                fill
                                className="rounded-circle"
                                src="/assets/img/avatars/4.jpg"
                                alt="user@email.com"
                              />
                              <span
                                className="avatar-status position-absolute d-block bottom-0 end-0 bg-secondary rounded-circle border border-white"
                              />
                            </div>
                          </td>
                          <td>
                            <div>Enéas Kwadwo</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">98%</div>
                              </div>
                              <div className="float-end">
                                <small className="text-black-50">
                                  Jun 11, 2020 - Jul 10, 2020
                                </small>
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="danger" now={98} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50">Last login</div>
                            <div className="fw-semibold">Last month</div>
                          </td>
                          <td>
                            <Dropdown align="end">
                              <Dropdown.Toggle
                                as="button"
                                bsPrefix="btn"
                                className="btn-link rounded-0 text-black-50 shadow-none p-0"
                                id="action-user4"
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
                        <tr className="align-middle">
                          <td className="text-center">
                            <div className="avatar avatar-md d-inline-flex position-relative">
                              <Image
                                fill
                                className="rounded-circle"
                                src="/assets/img/avatars/5.jpg"
                                alt="user@email.com"
                              />
                              <span
                                className="avatar-status position-absolute d-block bottom-0 end-0 bg-success rounded-circle border border-white"
                              />
                            </div>
                          </td>
                          <td>
                            <div>Agapetus Tadeáš</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">22%</div>
                              </div>
                              <div className="float-end">
                                <small className="text-black-50">
                                  Jun 11, 2020 - Jul 10, 2020
                                </small>
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="info" now={22} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50">Last login</div>
                            <div className="fw-semibold">Last week</div>
                          </td>
                          <td>
                            <Dropdown align="end">
                              <Dropdown.Toggle
                                as="button"
                                bsPrefix="btn"
                                className="btn-link rounded-0 text-black-50 shadow-none p-0"
                                id="action-user5"
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
                        <tr className="align-middle">
                          <td className="text-center">
                            <div className="avatar avatar-md d-inline-flex position-relative">
                              <Image
                                fill
                                className="rounded-circle"
                                src="/assets/img/avatars/6.jpg"
                                alt="user@email.com"
                              />
                              <span
                                className="avatar-status position-absolute d-block bottom-0 end-0 bg-danger rounded-circle border border-white"
                              />
                            </div>
                          </td>
                          <td>
                            <div>Friderik Dávid</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">43%</div>
                              </div>
                              <div className="float-end">
                                <small className="text-black-50">
                                  Jun 11, 2020 - Jul 10, 2020
                                </small>
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="success" now={43} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50">Last login</div>
                            <div className="fw-semibold">Yesterday</div>
                          </td>
                          <td>
                            <Dropdown align="end">
                              <Dropdown.Toggle
                                as="button"
                                bsPrefix="btn"
                                className="btn-link rounded-0 text-black-50 shadow-none p-0"
                                id="action-user6"
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
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </AdminLayout>
    )
}