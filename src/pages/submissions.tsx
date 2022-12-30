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
import axios from "axios";
import { useEffect, useState } from "react";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";  

import { FileUpload } from 'primereact/fileupload';
import { SelectParametersFilterSensitiveLog } from '@aws-sdk/client-s3';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)



export default function Submissions(){
    const [file, setFile] = useState<any>(null);
    const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);
  
    const uploadFile = async () => {
      setUploadingStatus(true);
      let time1 =  new Date().toLocaleString();
      let team = "teamagent2"
      let time = time1.split('/').join('-');
      let fileName = "bot-"+team+"-"+time+".py";
      // time = time.replace(/\//g, '-');
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
            <input type="file" name = "image" id ="selectFile" onChange={(e:any) => setFile(e.target.files[0])} />
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
                          <th>Bot Win Rate</th>
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
                            <div>bot5.py</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">100%</div>
                              </div>
                              <div className="float-end">
                          
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="success" now={100} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50"></div>
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
                            <div>bot4.py</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">100%</div>
                              </div>
                              <div className="float-end">
                            
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="info" now={100} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50"></div>
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
                            <div>bot3.py</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">100%</div>
                              </div>
                              <div className="float-end">
                              
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="warning" now={100} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50"></div>
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
                            <div>bot2.py</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">100%</div>
                              </div>
                              <div className="float-end">
                                
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="danger" now={100} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50"></div>
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
                            <div>bot1.py</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">100%</div>
                              </div>
                              <div className="float-end">
                                
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="info" now={100} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50"></div>
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
                            <div>bot0.py</div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <div className="float-start">
                                <div className="fw-semibold">100%</div>
                              </div>
                              <div className="float-end">
                              
                              </div>
                            </div>
                            <ProgressBar className="progress-thin" variant="success" now={100} />
                          </td>
                          <td className="text-center">
                            <FontAwesomeIcon icon={faFoursquare} size="lg" fixedWidth />
                          </td>
                          <td>
                            <div className="small text-black-50"></div>
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