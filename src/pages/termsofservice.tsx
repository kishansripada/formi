import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useRef, useCallback } from "react";

import { useRouter } from "next/navigation";
import { type } from "os";
import Link from "next/link";
import { Header } from "../components/NonAppComponents/Header";

import toast, { Toaster } from "react-hot-toast";

const privacy = ({}: {}) => {
   return (
      <article className="mx-[15%]">
         <style
            dangerouslySetInnerHTML={{
               __html:
                  "\n  [data-custom-class='body'], [data-custom-class='body'] * {\n          background: transparent !important;\n        }\n[data-custom-class='title'], [data-custom-class='title'] * {\n          font-family: Arial !important;\nfont-size: 26px !important;\ncolor: #000000 !important;\n        }\n[data-custom-class='subtitle'], [data-custom-class='subtitle'] * {\n          font-family: Arial !important;\ncolor: #595959 !important;\nfont-size: 14px !important;\n        }\n[data-custom-class='heading_1'], [data-custom-class='heading_1'] * {\n          font-family: Arial !important;\nfont-size: 19px !important;\ncolor: #000000 !important;\n        }\n[data-custom-class='heading_2'], [data-custom-class='heading_2'] * {\n          font-family: Arial !important;\nfont-size: 17px !important;\ncolor: #000000 !important;\n        }\n[data-custom-class='body_text'], [data-custom-class='body_text'] * {\n          color: #595959 !important;\nfont-size: 14px !important;\nfont-family: Arial !important;\n        }\n[data-custom-class='link'], [data-custom-class='link'] * {\n          color: #3030F1 !important;\nfont-size: 14px !important;\nfont-family: Arial !important;\nword-break: break-word !important;\n        }\n",
            }}
         />
         <div data-custom-class="body">
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div align="center" className="MsoNormal" data-custom-class="title" style={{ textAlign: "left", lineHeight: "1.5" }}>
                  <a name="_gm5sejt4p02f" />
                  <strong>
                     <span style={{ lineHeight: "150%", fontFamily: "Arial", fontSize: 26 }}>
                        <bdt className="block-component" />
                        <bdt className="question">TERMS OF SERVICE</bdt>
                        <bdt className="statement-end-if-in-editor" />
                     </span>
                  </strong>
               </div>
               <div align="center" className="MsoNormal" style={{ textAlign: "center", lineHeight: "1.5" }}>
                  <a name="_7m5b3xg56u7y" />
               </div>
               <div align="center" className="MsoNormal" data-custom-class="subtitle" style={{ textAlign: "left", lineHeight: "1.5" }}>
                  <br />
               </div>
               <div align="center" className="MsoNormal" data-custom-class="subtitle" style={{ textAlign: "left", lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "150%",
                        fontFamily: "Arial",
                        color: "#A6A6A6",
                        msoThemecolor: "background1",
                        msoThemeshade: 166,
                     }}
                  >
                     <span
                        style={{
                           color: "rgb(127, 127, 127)",
                           fontSize: 15,
                           textAlign: "justify",
                        }}
                     >
                        <strong>Last updated</strong>
                     </span>
                     <strong>
                        <span
                           style={{
                              color: "rgb(127,127,127)",
                              fontSize: "14.6667px",
                              textAlign: "justify",
                           }}
                        >
                           &nbsp;
                        </span>
                     </strong>
                     <span
                        style={{
                           color: "rgb(127, 127, 127)",
                           fontSize: 15,
                           textAlign: "justify",
                        }}
                     >
                        <bdt
                           className="block-container question question-in-editor"
                           data-id="0d5ae8ae-7749-9afb-1fed-6556cb563dc0"
                           data-type="question"
                        >
                           <strong>September 17, 2022</strong>
                        </bdt>
                     </span>
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <strong>
                  <span data-custom-class="heading_1">TABLE OF CONTENTS</span>
               </strong>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#agreement">
                  <span style={{ fontSize: 15 }}>
                     <span data-custom-class="body_text">1. AGREEMENT TO TERMS</span>
                  </span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#ip">
                  <span data-custom-class="body_text">2. INTELLECTUAL PROPERTY RIGHTS</span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#userreps">
                  <span data-custom-class="body_text">3. USER REPRESENTATIONS</span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
               <a data-custom-class="link" href="#userreg">
                  <span data-custom-class="body_text">4. USER REGISTRATION</span>
               </a>
               <bdt className="statement-end-if-in-editor">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#payment">
                  <span data-custom-class="body_text">5. FEES AND PAYMENT</span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#cancel">
                  <span data-custom-class="body_text">6. CANCELLATION</span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#prohibited">
                  <span data-custom-class="body_text">7. PROHIBITED ACTIVITIES</span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#ugc">
                  <span data-custom-class="body_text">8. USER GENERATED CONTRIBUTIONS</span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#license">
                  <span data-custom-class="body_text">9. CONTRIBUTION LICENSE</span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
               <a data-custom-class="link" href="#socialmedia">
                  <span data-custom-class="body_text">10. SOCIAL MEDIA</span>
               </a>
               <bdt className="statement-end-if-in-editor">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#submissions">
                  <span data-custom-class="body_text">11. SUBMISSIONS</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
               <a data-custom-class="link" href="#usrights">
                  <span data-custom-class="body_text">12. U.S. GOVERNMENT RIGHTS</span>
               </a>
               <bdt className="statement-end-if-in-editor">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#sitemanage">
                  <span data-custom-class="body_text">13. SITE MANAGEMENT</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
               <a data-custom-class="link" href="#privacypolicy1">
                  <span data-custom-class="body_text">14. PRIVACY POLICY</span>
               </a>
               <bdt className="statement-end-if-in-editor">
                  <span data-custom-class="body_text" />
               </bdt>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
               <span data-custom-class="body_text">
                  <bdt className="block-component" />
                  <bdt className="block-component" />
               </span>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#terms">
                  <span data-custom-class="body_text">15. TERM AND TERMINATION</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#modifications">
                  <span data-custom-class="body_text">16. MODIFICATIONS AND INTERRUPTIONS</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#law">
                  <span data-custom-class="body_text">17. GOVERNING LAW</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#disputes">
                  <span data-custom-class="body_text">18. DISPUTE RESOLUTION</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#corrections">
                  <span data-custom-class="body_text">19. CORRECTIONS</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#disclaimer">
                  <span data-custom-class="body_text">20. DISCLAIMER</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#liability">
                  <span data-custom-class="body_text">21. LIMITATIONS OF LIABILITY</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#indemnification">
                  <span data-custom-class="body_text">22. INDEMNIFICATION</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#userdata">
                  <span data-custom-class="body_text">23. USER DATA</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#electronic">
                  <span data-custom-class="body_text">24. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span data-custom-class="body_text" />
               </bdt>
               <a data-custom-class="link" href="#california">
                  <span data-custom-class="body_text">25. CALIFORNIA USERS AND RESIDENTS</span>
               </a>
               <bdt className="statement-end-if-in-editor">
                  <span data-custom-class="body_text" />
               </bdt>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#misc">
                  <span data-custom-class="body_text">26. MISCELLANEOUS</span>
               </a>
            </div>
            <div style={{ lineHeight: "1.5" }}>
               <a data-custom-class="link" href="#contact">
                  <span data-custom-class="body_text">27. CONTACT US</span>
               </a>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="heading_1" id="agreement" style={{ lineHeight: "1.5" }}>
                  <a name="_6aa3gkhykvst" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>1. AGREEMENT TO TERMS</span>
                  </strong>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     These <bdt className="block-component" />
                     <bdt className="question">Terms of Service</bdt>
                     <bdt className="statement-end-if-in-editor" /> constitute a legally binding agreement made between you, whether personally or on
                     behalf of an entity (“you”) and{" "}
                     <bdt className="block-container question question-in-editor" data-id="9d459c4e-c548-e5cb-7729-a118548965d2" data-type="question">
                        Naach
                     </bdt>
                  </span>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     <bdt className="block-component" />
                     &nbsp;
                  </span>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     ("
                     <bdt className="block-component" />
                     <strong>Company</strong>
                     <bdt className="statement-end-if-in-editor" />
                     ", “<strong>we</strong>”, “<strong>us</strong>”, or “<strong>our</strong>”), concerning your access to and use of the{" "}
                     <bdt className="block-container question question-in-editor" data-id="fdf30452-99b8-c68b-5cdf-34af764cd1fd" data-type="question">
                        <a href="https://www.naach.app" target="_blank" data-custom-class="link">
                           https://www.naach.app
                        </a>
                     </bdt>{" "}
                     website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise
                     connected thereto (collectively, the “Site”).
                     <span
                        style={{
                           fontSize: "11.0pt",
                           lineHeight: "115%",
                           msoFareastFontFamily: "Calibri",
                           color: "#595959",
                           msoThemecolor: "text1",
                           msoThemetint: 166,
                        }}
                     >
                        <span
                           style={{
                              fontSize: "11.0pt",
                              lineHeight: "115%",
                              msoFareastFontFamily: "Calibri",
                              color: "#595959",
                              msoThemecolor: "text1",
                              msoThemetint: 166,
                           }}
                        >
                           <span
                              style={{
                                 fontSize: "11.0pt",
                                 lineHeight: "115%",
                                 msoFareastFontFamily: "Calibri",
                                 color: "#595959",
                                 msoThemecolor: "text1",
                                 msoThemetint: 166,
                              }}
                           >
                              <bdt className="question">
                                 <bdt className="block-component" />
                              </bdt>
                           </span>
                           <bdt className="block-component" />
                        </span>
                     </span>
                  </span>{" "}
                  You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these{" "}
                  <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" />
                  <bdt className="block-container if" data-type="if" id="c4a4c609-d962-97d8-9b96-d3492402adad">
                     <bdt data-type="conditional-block">
                        <bdt className="block-component" data-record-question-key="separate_agreement_option" data-type="statement" />
                     </bdt>
                     . IF YOU DO NOT AGREE WITH ALL OF THESE <bdt className="block-component" />
                     <bdt className="question">TERMS OF SERVICE</bdt>
                     <bdt className="statement-end-if-in-editor" />, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE
                     USE IMMEDIATELY.
                  </bdt>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span style={{ fontSize: 15 }}>
                     <span
                        style={{
                           lineHeight: "115%",
                           fontFamily: "Arial",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly
                        incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these{" "}
                        <bdt className="block-component" />
                        <bdt className="question">Terms of Service</bdt>
                        <bdt className="statement-end-if-in-editor" /> <bdt className="block-component" />
                        at any time and for any reason
                        <bdt className="statement-end-if-in-editor" />. We will alert you about any changes by updating the “Last updated” date of
                        these <bdt className="block-component" />
                        <bdt className="question">Terms of Service</bdt>
                        <bdt className="statement-end-if-in-editor" />, and you waive any right to receive specific notice of each such change. Please
                        ensure that you check the applicable Terms every time you use our Site so that you understand which Terms apply. You will be
                        subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised{" "}
                        <bdt className="block-component" />
                        <bdt className="question">Terms of Service</bdt>
                        <bdt className="statement-end-if-in-editor" /> by your continued use of the Site after the date such revised{" "}
                        <bdt className="block-component" />
                        <bdt className="question">Terms of Service</bdt>
                        <bdt className="statement-end-if-in-editor" /> are posted.
                     </span>
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or
                     country where such distribution or use would be contrary to law or regulation or which would subject us to any registration
                     requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Site from other locations do
                     so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are
                     applicable.
                  </span>
               </div>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     <bdt className="block-component" />
                     <bdt className="block-component" />
                  </span>
               </div>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     The Site is not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act
                     (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you
                     may not use this Site. You may not use the Site in a way that would violate the Gramm-Leach-Bliley Act (GLBA).
                     <bdt className="block-component" />
                     <bdt className="statement-end-if-in-editor" />
                  </span>
               </div>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <bdt className="block-container if" data-type="if" id="a2595956-7028-dbe5-123e-d3d3a93ed076">
                     <bdt data-type="conditional-block">
                        <span style={{ fontSize: 15 }}>
                           <bdt className="block-component" data-record-question-key="user_o18_option" data-type="statement" />
                           <bdt className="block-container if" data-type="if" id="a2595956-7028-dbe5-123e-d3d3a93ed076">
                              <bdt data-type="conditional-block">
                                 <bdt data-type="body">
                                    <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                                       The Site is intended for users who are at least 13 years of age. All users who are minors in the jurisdiction
                                       in which they reside (generally under the age of 18) must have the permission of, and be directly supervised
                                       by, their parent or guardian to use the Site. If you are a minor, you must have your parent or guardian read
                                       and agree to these <bdt className="block-component" />
                                       <bdt className="question">Terms of Service</bdt>
                                       <bdt className="statement-end-if-in-editor" />
                                       &nbsp;
                                    </span>
                                    <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>prior to you using the Site.</span>
                                 </bdt>
                              </bdt>
                           </bdt>
                        </span>
                     </bdt>
                  </bdt>
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                           <bdt className="block-component" />
                        </span>
                     </bdt>
                  </bdt>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" data-custom-class="heading_1" id="ip" style={{ lineHeight: "1.5" }}>
                  <a name="_b6y29mp52qvx" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>2. INTELLECTUAL PROPERTY RIGHTS</span>
                  </strong>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website
                     designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service
                     marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright
                     and trademark laws and various other intellectual property rights and unfair competition laws of the United States, international
                     copyright laws, and international conventions. The Content and the Marks are provided on the Site “AS IS” for your information
                     and personal use only. Except as expressly provided in these <bdt className="block-component" />
                     <bdt className="question">Terms of Service</bdt>
                     <bdt className="statement-end-if-in-editor" />, no part of the Site and no Content or Marks may be copied, reproduced,
                     aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or
                     otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     Provided that you are eligible to use the Site, you are granted a limited license to access and use the Site and to download or
                     print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use.
                     We reserve all rights not expressly granted to you in and to the Site, the Content and the Marks.
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" data-custom-class="heading_1" id="userreps" style={{ lineHeight: "1.5" }}>
                  <a name="_5hg7kgyv9l8z" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>3. USER REPRESENTATIONS</span>
                  </strong>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     By using the Site, you represent and warrant that:
                  </span>
                  <bdt className="block-container if" data-type="if" id="d2d82ca8-275f-3f86-8149-8a5ef8054af6">
                     <bdt data-type="conditional-block">
                        <bdt className="block-component" data-record-question-key="user_account_option" data-type="statement">
                           <span style={{ fontSize: 15 }} />
                        </bdt>
                        <bdt data-type="body">
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: "11pt" }}>&nbsp;(</span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>1)</span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: "11pt" }}>&nbsp;</span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                              all registration information you submit will be true, accurate, current, and complete; (
                           </span>
                           <span style={{ fontSize: 15 }}>
                              <span style={{ color: "rgb(89, 89, 89)" }}>2</span>
                           </span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                              ) you will maintain the accuracy of such information and promptly update such registration information
                           </span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: "11pt" }}>&nbsp;</span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>as necessary;</span>
                        </bdt>
                     </bdt>
                     <bdt className="statement-end-if-in-editor" data-type="close">
                        <span style={{ fontSize: 15 }} />
                     </bdt>
                     &nbsp;
                  </bdt>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>(</span>
                  <span style={{ fontSize: 15 }}>
                     <span style={{ color: "rgb(89, 89, 89)" }}>3</span>
                  </span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                     ) you have the legal capacity and you agree to comply with these <bdt className="block-component" />
                     <bdt className="question">Terms of Service</bdt>
                     <bdt className="statement-end-if-in-editor" />; <bdt className="block-component" />
                  </span>
                  <bdt className="block-container if" data-type="if" id="8d4c883b-bc2c-f0b4-da3e-6d0ee51aca13">
                     <bdt data-type="conditional-block">
                        <bdt data-type="body">
                           <span style={{ fontSize: 15 }}>
                              <span style={{ color: "rgb(89, 89, 89)" }}>(4</span>
                           </span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>)</span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: "11pt" }}>&nbsp;</span>
                           <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>you are not under the age of 13;&nbsp;</span>
                        </bdt>
                     </bdt>
                     <bdt className="statement-end-if-in-editor" data-type="close">
                        <span style={{ fontSize: 15 }} />
                     </bdt>
                  </bdt>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>(</span>
                  <span style={{ fontSize: 15 }}>
                     <span style={{ color: "rgb(89, 89, 89)" }}>5</span>
                  </span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                     ) you are not a minor in the jurisdiction in which you reside
                     <bdt className="block-container if" data-type="if" id="76948fab-ec9e-266a-bb91-948929c050c9">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="user_o18_option" data-type="statement" />
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="76948fab-ec9e-266a-bb91-948929c050c9">
                        <bdt data-type="conditional-block">
                           <bdt data-type="body">,&nbsp;</bdt>
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="76948fab-ec9e-266a-bb91-948929c050c9">
                        <bdt data-type="conditional-block">
                           <bdt data-type="body">or if a minor, you have received parental permission to use the Site</bdt>
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="76948fab-ec9e-266a-bb91-948929c050c9">
                        <bdt className="statement-end-if-in-editor" data-type="close" />
                     </bdt>
                     ;
                  </span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "11pt" }}>&nbsp;</span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>(</span>
                  <span style={{ fontSize: 15 }}>
                     <span style={{ color: "rgb(89, 89, 89)" }}>6</span>
                  </span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                     ) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise;
                  </span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: "11pt" }}>&nbsp;</span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>(</span>
                  <span style={{ fontSize: 15 }}>
                     <span style={{ color: "rgb(89, 89, 89)" }}>7</span>
                  </span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                     ) you will not use the Site for any illegal or unauthorized purpose; and (
                  </span>
                  <span style={{ fontSize: 15 }}>
                     <span style={{ color: "rgb(89, 89, 89)" }}>8</span>
                  </span>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>
                     ) your use of the Site will not violate any applicable law or regulation.
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate
                     your account and refuse any and all current or future use of the Site (or any portion thereof).
                  </span>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: 1 }}>
                  <bdt className="block-container if" data-type="if" id="d13abc62-cc6f-e059-7fd6-cb6208085aa7">
                     <bdt data-type="conditional-block">
                        <bdt className="block-component" data-record-question-key="user_account_option" data-type="statement" />
                        <bdt data-type="body">
                           <div className="MsoNormal" data-custom-class="heading_1" id="userreg" style={{ lineHeight: "1.5", textAlign: "left" }}>
                              <strong>
                                 <span
                                    style={{
                                       lineHeight: "115%",
                                       fontFamily: "Arial",
                                       fontSize: 19,
                                    }}
                                 >
                                    4. USER REGISTRATION
                                 </span>
                              </strong>
                           </div>
                        </bdt>
                     </bdt>
                  </bdt>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: 1 }}>
                  <bdt className="block-container if" data-type="if">
                     <bdt data-type="conditional-block">
                        <bdt data-type="body">
                           <div className="MsoNormal" data-custom-class="body_text" style={{ textAlign: "left", lineHeight: "1.5" }}>
                              <span
                                 style={{
                                    fontSize: 15,
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 You may be required to register with the Site. You agree to keep your password confidential and will be responsible
                                 for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if
                                 we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                              </span>
                           </div>
                        </bdt>
                     </bdt>
                  </bdt>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <bdt className="block-container if" data-type="if">
                     <bdt className="statement-end-if-in-editor" data-type="close" />
                  </bdt>
               </div>
               <div className="MsoNormal" data-custom-class="heading_1" id="payment" style={{ lineHeight: "1.5" }}>
                  <a name="_ynub0jdx8pob" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>5. FEES AND PAYMENT</span>
                  </strong>
               </div>
               <div className="MsoNormal" style={{ lineHeight: 1 }}>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     <br />
                  </span>
               </div>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span style={{ color: "rgb(89, 89, 89)", fontSize: 15 }}>We accept the following forms of payment:</span>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: 1 }}>
                  <div className="MsoNormal" style={{ lineHeight: "17.25px" }}>
                     <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: 1, textAlign: "left" }}>
                        <br />
                     </div>
                     <div
                        className="MsoNormal"
                        data-custom-class="body_text"
                        style={{
                           marginLeft: "46.9pt",
                           textIndent: "-18.55pt",
                           lineHeight: "1.5",
                           textAlign: "left",
                        }}
                     >
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="block-container forloop" data-type="forloop" id="a6e21b8e-b955-c546-15dd-bb6eda2fe88a">
                              <bdt data-type="conditional-block">
                                 <bdt className="forloop-component" data-record-question-key="payment_list" data-type="statement" />
                              </bdt>
                           </bdt>
                           <bdt className="block-container forloop" data-type="forloop" id="a6e21b8e-b955-c546-15dd-bb6eda2fe88a">
                              <bdt data-type="conditional-block">
                                 <bdt data-type="body">
                                    <span style={{ textIndent: "-24.7333px" }}>- &nbsp;Visa</span>
                                 </bdt>
                              </bdt>
                           </bdt>
                        </span>
                     </div>
                     <div
                        className="MsoNormal"
                        data-custom-class="body_text"
                        style={{
                           marginLeft: "46.9pt",
                           textIndent: "-18.55pt",
                           lineHeight: "1.5",
                           textAlign: "left",
                        }}
                     >
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="block-container forloop" data-type="forloop">
                              <bdt className="for-end-in-editor" data-type="close" />
                           </bdt>
                           <bdt className="block-container forloop" data-type="forloop" id="a6e21b8e-b955-c546-15dd-bb6eda2fe88a">
                              <bdt data-type="conditional-block">
                                 <bdt data-type="body">
                                    <span style={{ textIndent: "-24.7333px" }}>- &nbsp;Mastercard</span>
                                 </bdt>
                              </bdt>
                           </bdt>
                        </span>
                     </div>
                     <div
                        className="MsoNormal"
                        data-custom-class="body_text"
                        style={{
                           marginLeft: "46.9pt",
                           textIndent: "-18.55pt",
                           lineHeight: "1.5",
                           textAlign: "left",
                        }}
                     >
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="block-container forloop" data-type="forloop">
                              <bdt className="for-end-in-editor" data-type="close" />
                           </bdt>
                           <bdt className="block-container forloop" data-type="forloop" id="a6e21b8e-b955-c546-15dd-bb6eda2fe88a">
                              <bdt data-type="conditional-block">
                                 <bdt data-type="body">
                                    <span style={{ textIndent: "-24.7333px" }}>- &nbsp;American Express</span>
                                 </bdt>
                              </bdt>
                           </bdt>
                        </span>
                     </div>
                     <div
                        className="MsoNormal"
                        data-custom-class="body_text"
                        style={{
                           marginLeft: "46.9pt",
                           textIndent: "-18.55pt",
                           lineHeight: "1.5",
                           textAlign: "left",
                        }}
                     >
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="block-container forloop" data-type="forloop">
                              <bdt className="for-end-in-editor" data-type="close" />
                           </bdt>
                           <bdt className="block-container forloop" data-type="forloop" id="a6e21b8e-b955-c546-15dd-bb6eda2fe88a">
                              <bdt data-type="conditional-block">
                                 <bdt data-type="body">
                                    <span style={{ textIndent: "-24.7333px" }}>- &nbsp;Discover</span>
                                 </bdt>
                              </bdt>
                           </bdt>
                        </span>
                     </div>
                     <div
                        className="MsoNormal"
                        data-custom-class="body_text"
                        style={{
                           marginLeft: "46.9pt",
                           textIndent: "-18.55pt",
                           lineHeight: "1.5",
                           textAlign: "left",
                        }}
                     >
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="block-container forloop" data-type="forloop">
                              <bdt className="for-end-in-editor" data-type="close" />
                           </bdt>
                           <bdt className="block-container forloop" data-type="forloop" id="a6e21b8e-b955-c546-15dd-bb6eda2fe88a">
                              <bdt data-type="conditional-block">
                                 <bdt data-type="body">
                                    <span style={{ textIndent: "-24.7333px" }}>- &nbsp;PayPal</span>
                                 </bdt>
                              </bdt>
                           </bdt>
                        </span>
                     </div>
                     <div
                        className="MsoNormal"
                        data-custom-class="body_text"
                        style={{
                           marginLeft: "46.9pt",
                           textIndent: "-18.55pt",
                           lineHeight: "1.5",
                           textAlign: "left",
                        }}
                     >
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="block-container forloop" data-type="forloop">
                              <bdt className="for-end-in-editor" data-type="close" />
                           </bdt>
                        </span>
                     </div>
                  </div>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     <div className="MsoNormal" style={{ lineHeight: 1, textAlign: "left" }}>
                        <br />
                     </div>
                  </span>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ lineHeight: "115%", color: "rgb(89, 89, 89)" }}>
                           You may be required to purchase or pay a fee to access some of our services. You agree to provide current, complete, and
                           accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account
                           and payment information, including email address, payment method, and payment card expiration date, so that we can complete
                           your transactions and contact you as needed. We bill you through an online billing account for purchases made via the Site.
                           Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments
                           shall be in <bdt className="question">U.S. dollars</bdt>.
                        </span>
                     </div>
                  </span>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     <div className="MsoNormal" style={{ lineHeight: 1, textAlign: "left" }}>
                        <br />
                     </div>
                     <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "115%",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           You agree to pay all charges or fees at the prices then in effect for your purchases, and you authorize us to charge your
                           chosen payment provider for any such amounts upon making your purchase.{" "}
                           <bdt className="block-container if" data-type="if" id="2955e4e9-b2fc-b1ce-6d2e-99ed4a0c390d">
                              <bdt data-type="conditional-block">
                                 <bdt className="block-component" data-record-question-key="recurring_charge_option" data-type="statement" />
                              </bdt>
                           </bdt>
                           <bdt className="block-container if" data-type="if" id="2955e4e9-b2fc-b1ce-6d2e-99ed4a0c390d">
                              <bdt data-type="conditional-block">
                                 <bdt data-type="body">If&nbsp;</bdt>
                              </bdt>
                           </bdt>
                           <bdt className="block-container if" data-type="if" id="2955e4e9-b2fc-b1ce-6d2e-99ed4a0c390d">
                              <bdt data-type="conditional-block">
                                 <bdt data-type="body">
                                    your purchase is subject to recurring charges, then you consent to our charging your payment method on a recurring
                                    basis without requiring your prior approval for each recurring charge, until you notify us of your cancellation.
                                 </bdt>
                              </bdt>
                           </bdt>
                           <bdt className="block-container if" data-type="if" id="2955e4e9-b2fc-b1ce-6d2e-99ed4a0c390d">
                              <bdt className="statement-end-if-in-editor" data-type="close" />
                           </bdt>
                        </span>
                     </div>
                     <br />
                  </span>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ lineHeight: "115%", color: "rgb(89, 89, 89)" }}>
                           We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.
                           We also reserve the right to refuse any order placed through the Site.
                        </span>
                     </div>
                  </span>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: 1 }}>
                  <div className="MsoNormal" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <a name="_drzjqilz2ujm" />
                  </div>
                  <bdt className="block-container if" data-type="if" id="4380167d-5abe-b98f-f389-f707429e6c52">
                     <bdt data-type="conditional-block">
                        <bdt className="block-component" data-record-question-key="free_trial_option" data-type="statement" />
                     </bdt>
                     <div className="MsoNormal" data-custom-class="heading_1" id="cancel" style={{ textAlign: "left", lineHeight: "1.5" }}>
                        <a name="_e993diqrk0qx" />
                        <strong>
                           <span
                              style={{
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 fontSize: 19,
                              }}
                           >
                              6. CANCELLATION
                           </span>
                        </strong>
                     </div>
                  </bdt>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="cef55cf6-3a65-8031-d0c3-cffe36e64f10">
                           <bdt data-type="conditional-block">
                              <bdt className="block-component" data-record-question-key="return_option" data-type="statement" />
                           </bdt>
                        </bdt>
                        <bdt className="block-container if" data-type="if" id="cef55cf6-3a65-8031-d0c3-cffe36e64f10">
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">All purchases are non-refundable.</bdt>
                           </bdt>
                        </bdt>
                        <bdt className="block-container if" data-type="if" id="cef55cf6-3a65-8031-d0c3-cffe36e64f10">
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">&nbsp;</bdt>
                           </bdt>
                        </bdt>
                        <bdt className="block-container if" data-type="if" id="cef55cf6-3a65-8031-d0c3-cffe36e64f10">
                           <bdt className="statement-end-if-in-editor" data-type="close" />
                        </bdt>
                        You can cancel your subscription at any time
                     </span>
                     <span
                        style={{
                           fontSize: "11.0pt",
                           lineHeight: "115%",
                           color: "#595959",
                           msoThemecolor: "text1",
                           msoThemetint: 166,
                        }}
                     >
                        &nbsp;
                     </span>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="1a40a488-252c-f087-02cc-5e0de451aa88">
                           <bdt data-type="conditional-block">
                              <bdt className="block-component" data-record-question-key="cancel_how" data-type="statement" />
                           </bdt>
                        </bdt>
                        <bdt className="block-container if" data-type="if" id="1a40a488-252c-f087-02cc-5e0de451aa88">
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">by logging</bdt>
                           </bdt>
                        </bdt>
                     </span>
                     <span
                        style={{
                           fontSize: "11.0pt",
                           lineHeight: "115%",
                           color: "#595959",
                           msoThemecolor: "text1",
                           msoThemetint: 166,
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="1a40a488-252c-f087-02cc-5e0de451aa88">
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">&nbsp;</bdt>
                           </bdt>
                        </bdt>
                     </span>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="1a40a488-252c-f087-02cc-5e0de451aa88">
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">into your account</bdt>
                           </bdt>
                        </bdt>
                        <bdt className="block-container if" data-type="if" id="1a40a488-252c-f087-02cc-5e0de451aa88">
                           <bdt data-type="conditional-block">
                              <bdt className="block-component" data-record-question-key="null" data-type="statement" />
                           </bdt>
                           . Your cancellation will take effect at the end of the current paid term.
                        </bdt>
                     </span>
                  </div>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "1.5" }}>
                  <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        If you are unsatisfied with our services, please email us at{" "}
                        <bdt
                           className="block-container question question-in-editor"
                           data-id="7c40698b-5cc8-bb58-245d-2fbd1b57dfba"
                           data-type="question"
                        >
                           contact@naach.app
                        </bdt>
                        <bdt className="block-component" /> or call us at
                     </span>
                     <span
                        style={{
                           fontSize: "11.0pt",
                           lineHeight: "115%",
                           color: "#595959",
                           msoThemecolor: "text1",
                           msoThemetint: 166,
                        }}
                     >
                        &nbsp;
                     </span>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        <bdt
                           className="block-container question question-in-editor"
                           data-id="7d27e26e-2e8b-6d22-d41d-b468e8115f39"
                           data-type="question"
                        >
                           2486868886
                        </bdt>
                     </span>
                     <span
                        style={{
                           fontSize: "11.0pt",
                           lineHeight: "115%",
                           color: "#595959",
                           msoThemecolor: "text1",
                           msoThemetint: 166,
                        }}
                     >
                        <span
                           style={{
                              fontSize: "11.0pt",
                              lineHeight: "115%",
                              color: "#595959",
                              msoThemecolor: "text1",
                              msoThemetint: 166,
                           }}
                        >
                           <span
                              style={{
                                 fontSize: 15,
                                 lineHeight: "115%",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              <span
                                 style={{
                                    fontSize: 15,
                                    lineHeight: "115%",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <bdt className="statement-end-if-in-editor" />
                              </span>
                           </span>
                        </span>
                        .
                     </span>
                  </div>
                  <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                     <br />
                  </div>
                  <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                     <br />
                  </div>
                  <div className="MsoNormal" style={{ lineHeight: 1 }}>
                     <bdt className="block-container if" data-type="if" id="b671a946-ab46-9fff-9cee-e88149335e8e">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="software_option" data-type="statement" />
                        </bdt>
                     </bdt>
                  </div>
                  <div className="MsoNormal" data-custom-class="heading_1" id="prohibited" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <a name="_h284p8mrs3r7" />
                     <strong>
                        <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>7. PROHIBITED ACTIVITIES</span>
                     </strong>
                  </div>
               </div>
               <div className="MsoNormal" style={{ lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used
                     in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                  </span>
               </div>
               <div className="MsoNormal" style={{ lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "115%" }}>
                  <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "16.8667px",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        As a user of the Site, you agree not to:
                     </span>
                  </div>
                  <ul>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span
                           style={{
                              fontSize: "11pt",
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <span
                              style={{
                                 fontFamily: "sans-serif",
                                 fontSize: 15,
                                 fontStyle: "normal",
                                 fontVariantLigatures: "normal",
                                 fontVariantCaps: "normal",
                                 fontWeight: 400,
                                 letterSpacing: "normal",
                                 orphans: 2,
                                 textAlign: "justify",
                                 textIndent: "-29.4px",
                                 textTransform: "none",
                                 whiteSpace: "normal",
                                 widows: 2,
                                 wordSpacing: 0,
                                 WebkitTextStrokeWidth: 0,
                                 backgroundColor: "rgb(255, 255, 255)",
                                 textDecorationStyle: "initial",
                                 textDecorationColor: "initial",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection,
                              compilation, database, or directory without written permission from us.
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information
                                       such as user passwords.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Circumvent, disable, or otherwise interfere with security-related features of the Site, including features that
                                       prevent or restrict the use or copying of any Content or enforce limitations on the use of the Site and/or the
                                       Content contained therein.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Use any information obtained from the Site in order to harass, abuse, or harm another person.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Make improper use of our support services or submit false reports of abuse or misconduct.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Use the Site in a manner inconsistent with any applicable laws or regulations.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Engage in unauthorized framing of or linking to the Site.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including
                                       excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any
                                       party’s uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with
                                       the use, features, functions, operation, or maintenance of the Site.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Engage in any automated use of the system, such as using scripts to send comments or messages, or using any
                                       data mining, robots, or similar data gathering and extraction tools.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Delete the copyright or other proprietary rights notice from any Content.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Attempt to impersonate another user or person or use the username of another user.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active
                                       information collection or transmission mechanism, including without limitation, clear graphics interchange
                                       formats (“gifs”), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as “spyware”
                                       or “passive collection mechanisms” or “pcms”).
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the
                                       Site.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the
                                       Site to you.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion
                                       of the Site.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Copy or adapt the Site’s software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the
                                       software comprising or in any way making up a part of the Site.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or
                                       distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or
                                       offline reader that accesses the Site, or using or launching any unauthorized script or other software.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Use a buying agent or purchasing agent to make purchases on the Site.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by
                                       electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated
                                       means or under false pretenses.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <span
                                 style={{
                                    fontFamily: "sans-serif",
                                    fontStyle: "normal",
                                    fontVariantLigatures: "normal",
                                    fontVariantCaps: "normal",
                                    fontWeight: 400,
                                    letterSpacing: "normal",
                                    orphans: 2,
                                    textAlign: "justify",
                                    textIndent: "-29.4px",
                                    textTransform: "none",
                                    whiteSpace: "normal",
                                    widows: 2,
                                    wordSpacing: 0,
                                    WebkitTextStrokeWidth: 0,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    textDecorationStyle: "initial",
                                    textDecorationColor: "initial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       lineHeight: "16.8667px",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <span
                                       style={{
                                          fontFamily: "sans-serif",
                                          fontStyle: "normal",
                                          fontVariantLigatures: "normal",
                                          fontVariantCaps: "normal",
                                          fontWeight: 400,
                                          letterSpacing: "normal",
                                          orphans: 2,
                                          textAlign: "justify",
                                          textIndent: "-29.4px",
                                          textTransform: "none",
                                          whiteSpace: "normal",
                                          widows: 2,
                                          wordSpacing: 0,
                                          WebkitTextStrokeWidth: 0,
                                          backgroundColor: "rgb(255, 255, 255)",
                                          textDecorationStyle: "initial",
                                          textDecorationColor: "initial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       Use the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any
                                       revenue-generating endeavor or commercial enterprise.
                                    </span>
                                 </span>
                              </span>
                           </span>
                        </span>
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="forloop-component" />
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="question">Use the Site to advertise or offer to sell goods and services.</bdt>
                        </span>
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="forloop-component" />
                        </span>
                     </li>
                     <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="question">Sell or otherwise transfer your profile.</bdt>
                        </span>
                        <span
                           style={{
                              fontSize: 15,
                              lineHeight: "16.8667px",
                              color: "rgb(89, 89, 89)",
                           }}
                        >
                           <bdt className="forloop-component" />
                        </span>
                     </li>
                  </ul>
               </div>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <a name="_zbbv9tgty199" />
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="heading_1" id="ugc" style={{ lineHeight: "1.5" }}>
                           <strong>
                              <span
                                 style={{
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    fontSize: 19,
                                 }}
                              >
                                 8. USER GENERATED CONTRIBUTIONS
                              </span>
                           </strong>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "115%" }}>
                           <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                              <span
                                 style={{
                                    fontSize: 15,
                                    lineHeight: "16.8667px",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <bdt className="block-container if" data-type="if" id="24327c5d-a34f-f7e7-88f1-65a2f788484f">
                                    <bdt data-type="conditional-block">
                                       <bdt className="block-component" data-record-question-key="user_post_content_option" data-type="statement">
                                          <span style={{ fontSize: 15 }} />
                                       </bdt>
                                    </bdt>
                                 </bdt>
                                 The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other
                                 functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish,
                                 distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings,
                                 video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively,
                                 "Contributions"). Contributions may be viewable by other users of the Site and through third-party websites. As such,
                                 any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make
                                 available any Contributions, you thereby represent and warrant that:
                                 <bdt className="else-block">
                                    <bdt className="block-component" />
                                 </bdt>
                              </span>
                           </div>
                           <ul>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or
                                       copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to
                                       the copyright, patent, trademark, trade secret, or moral rights of any third party.
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to
                                       use and to authorize us, the Site, and other users of the Site to use your Contributions in any manner
                                       contemplated by the Site and these <bdt className="block-component" />
                                       <bdt className="question">Terms of Service</bdt>
                                       <bdt className="statement-end-if-in-editor" />.
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       You have the written consent, release, and/or permission of each and every identifiable individual person in
                                       your Contributions to use the name or likeness of each and every such identifiable individual person to enable
                                       inclusion and use of your Contributions in any manner contemplated by the Site and these{" "}
                                       <bdt className="block-component" />
                                       <bdt className="question">Terms of Service</bdt>
                                       <bdt className="statement-end-if-in-editor" />.
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>Your Contributions are not false, inaccurate, or misleading.</span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes,
                                       chain letters, spam, mass mailings, or other forms of solicitation.
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or
                                       otherwise objectionable (as determined by us).
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and
                                       to promote violence against a specific person or class of people.
                                       <br />
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions do not violate any applicable law, regulation, or rule.
                                       <br />
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions do not violate the privacy or publicity rights of any third party.
                                       <br />
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to
                                       protect the health or well-being of minors.
                                       <br />
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions do not include any offensive comments that are connected to race, national origin, gender,
                                       sexual preference, or physical handicap.
                                       <br />
                                    </span>
                                 </span>
                              </li>
                              <li className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                                 <span style={{ color: "rgb(89, 89, 89)" }}>
                                    <span style={{ fontSize: 14 }}>
                                       Your Contributions do not otherwise violate, or link to material that violates, any provision of these{" "}
                                       <bdt className="block-component" />
                                       <bdt className="question">Terms of Service</bdt>
                                       <bdt className="statement-end-if-in-editor" />, or any applicable law or regulation.
                                    </span>
                                 </span>
                              </li>
                           </ul>
                           <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                              <span
                                 style={{
                                    fontSize: 15,
                                    lineHeight: "16.8667px",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 Any use of the Site in violation of the foregoing violates these <bdt className="block-component" />
                                 <bdt className="question">Terms of Service</bdt>
                                 <bdt className="statement-end-if-in-editor" /> and may result in, among other things, termination or suspension of
                                 your rights to use the Site.
                              </span>
                           </div>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="heading_1" id="license" style={{ lineHeight: "1.5" }}>
                           <strong>
                              <span
                                 style={{
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    fontSize: 19,
                                 }}
                              >
                                 9. CONTRIBUTION LICENSE
                              </span>
                           </strong>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                           <span
                              style={{
                                 fontSize: 15,
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              <bdt className="block-container if" data-type="if" id="a088ddfb-d8c1-9e58-6f21-958c3f4f0709">
                                 <bdt data-type="conditional-block">
                                    <bdt className="block-component" data-record-question-key="user_post_content_option" data-type="statement" />
                                 </bdt>
                              </bdt>
                              By posting your Contributions to any part of the Site
                              <bdt className="block-container if" data-type="if" id="19652acc-9a2a-5ffe-6189-9474402fa6cc">
                                 <bdt data-type="conditional-block">
                                    <bdt className="block-component" data-record-question-key="socialnetwork_link_option" data-type="statement" />
                                 </bdt>
                              </bdt>
                              <bdt className="block-container if" data-type="if" id="19652acc-9a2a-5ffe-6189-9474402fa6cc">
                                 <bdt data-type="conditional-block">
                                    <bdt data-type="body">&nbsp;</bdt>
                                 </bdt>
                              </bdt>
                              <bdt className="block-container if" data-type="if" id="19652acc-9a2a-5ffe-6189-9474402fa6cc">
                                 <bdt data-type="conditional-block">
                                    <bdt data-type="body">
                                       or making Contributions accessible to the Site by linking your account from the Site to any of your social
                                       networking accounts
                                    </bdt>
                                 </bdt>
                              </bdt>
                              <bdt className="block-container if" data-type="if" id="19652acc-9a2a-5ffe-6189-9474402fa6cc">
                                 <bdt className="statement-end-if-in-editor" data-type="close" />
                              </bdt>
                              , you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted,
                              unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license
                              to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly
                              perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such
                              Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or
                              otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and
                              authorize sublicenses of the foregoing. The use and distribution may occur in any media formats and through any media
                              channels.
                           </span>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                           <span style={{ fontSize: 15 }}>
                              <span
                                 style={{
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 This license will apply to any form, media, or technology now known or hereafter developed, and includes our use of
                                 your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names,
                                 logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you
                                 warrant that moral rights have not otherwise been asserted in your Contributions.&nbsp;
                              </span>
                           </span>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                           <span style={{ fontSize: 15 }}>
                              <span
                                 style={{
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and
                                 any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable
                                 for any statements or representations in your Contributions provided by you in any area on the Site. You are solely
                                 responsible for your Contributions to the Site and you expressly agree to exonerate us from any and all
                                 responsibility and to refrain from any legal action against us regarding your Contributions.
                              </span>
                           </span>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                           <span
                              style={{
                                 fontSize: 15,
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions; (2)
                              to re-categorize any Contributions to place them in more appropriate locations on the Site; and (3) to pre-screen or
                              delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your
                              Contributions.
                           </span>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <bdt className="else-block" />
               <bdt className="block-container if" data-type="if" id="a378120a-96b1-6fa3-279f-63d5b96341d3">
                  <bdt data-type="conditional-block">
                     <bdt className="block-component" data-record-question-key="review_option" data-type="statement" />
                  </bdt>
                  <bdt className="block-container if" data-type="if" id="c954892f-02b9-c743-d1e8-faf0d59a4b70">
                     <bdt data-type="conditional-block">
                        <bdt className="block-component" data-record-question-key="mobile_app_option" data-type="statement" />
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="e9981d4e-3a93-85dd-654b-7ecdf4bfe7d2">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="socialnetwork_link_option" data-type="statement" />{" "}
                           <bdt data-type="body">
                              <div className="MsoNormal" data-custom-class="heading_1" id="socialmedia" style={{ lineHeight: "1.5" }}>
                                 <strong>
                                    <span
                                       style={{
                                          lineHeight: "115%",
                                          fontFamily: "Arial",
                                          fontSize: 19,
                                       }}
                                    >
                                       10. SOCIAL MEDIA
                                    </span>
                                 </strong>
                              </div>
                           </bdt>
                        </bdt>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                           <span
                              style={{
                                 fontSize: 15,
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              As part of the functionality of the Site, you may link your account with online accounts you have with third-party
                              service providers (each such account, a “Third-Party Account”) by either: (1) providing your Third-Party Account login
                              information through the Site; or (2) allowing us to access your Third-Party Account, as is permitted under the
                              applicable terms and conditions that govern your use of each Third-Party Account. You represent and warrant that you are
                              entitled to disclose your Third-Party Account login information to us and/or grant us access to your Third-Party
                              Account, without breach by you of any of the terms and conditions that govern your use of the applicable Third-Party
                              Account, and without obligating us to pay any fees or making us subject to any usage limitations imposed by the
                              third-party service provider of the Third-Party Account. By granting us access to any Third-Party Accounts, you
                              understand that (1) we may access, make available, and store (if applicable) any content that you have provided to and
                              stored in your Third-Party Account (the “Social Network Content”) so that it is available on and through the Site via
                              your account, including without limitation any friend lists and (2) we may submit to and receive from your Third-Party
                              Account additional information to the extent you are notified when you link your account with the Third-Party Account.
                              Depending on the Third-Party Accounts you choose and subject to the privacy settings that you have set in such
                              Third-Party Accounts, personally identifiable information that you post to your Third-Party Accounts may be available on
                              and through your account on the Site. Please note that if a Third-Party Account or associated service becomes
                              unavailable or our access to such Third-Party Account is terminated by the third-party service provider, then Social
                              Network Content may no longer be available on and through the Site. You will have the ability to disable the connection
                              between your account on the Site and your Third-Party Accounts at any time. PLEASE NOTE THAT YOUR RELATIONSHIP WITH THE
                              THIRD-PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR AGREEMENT(S) WITH
                              SUCH THIRD-PARTY SERVICE PROVIDERS. We make no effort to review any Social Network Content for any purpose, including
                              but not limited to, for accuracy, legality, or non-infringement, and we are not responsible for any Social Network
                              Content. You acknowledge and agree that we may access your email address book associated with a Third-Party Account and
                              your contacts list stored on your mobile device or tablet computer solely for purposes of identifying and informing you
                              of those contacts who have also registered to use the Site. You can deactivate the connection between the Site and your
                              Third-Party Account by contacting us using the contact information below or through your account settings (if
                              applicable). We will attempt to delete any information stored on our servers that was obtained through such Third-Party
                              Account, except the username and profile picture that become associated with your account.
                           </span>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <bdt className="block-container if" data-type="if">
                  <bdt className="statement-end-if-in-editor" data-type="close">
                     <span style={{ fontSize: 15 }} />
                  </bdt>
               </bdt>
               <div className="MsoNormal" data-custom-class="heading_1" id="submissions" style={{ lineHeight: "1.5" }}>
                  <a name="_wfq2hvrw11j4" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>11. SUBMISSIONS</span>
                  </strong>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     You acknowledge and agree that any questions, comments, suggestions, ideas, feedback, or other information regarding the Site
                     ("Submissions") provided by you to us are non-confidential and shall become our sole property. We shall own exclusive rights,
                     including all intellectual property rights, and shall be entitled to the unrestricted use and dissemination of these Submissions
                     for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you. You hereby waive all moral rights
                     to any such Submissions, and you hereby warrant that any such Submissions are original with you or that you have the right to
                     submit such Submissions. You agree there shall be no recourse against us for any alleged or actual infringement or
                     misappropriation of any proprietary right in your Submissions.
                  </span>
               </div>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ lineHeight: 1 }}>
                  <bdt className="block-container if" data-type="if" id="36ce5a69-4560-4947-dc72-46e53e2d562a">
                     <bdt data-type="conditional-block">
                        <bdt className="block-component" data-record-question-key="3rd_party_option" data-type="statement" />
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="14038561-dad7-be9d-370f-f8aa487b2570">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="advertiser_option" data-type="statement">
                              <bdt className="block-component" />
                           </bdt>
                        </bdt>
                     </bdt>
                  </bdt>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "115%" }}>
                  <div className="MsoNormal" data-custom-class="heading_1" id="usrights" style={{ textAlign: "left", lineHeight: "1.5" }}>
                     <strong>
                        <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>12. U.S. GOVERNMENT RIGHTS</span>
                     </strong>
                  </div>
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ textAlign: "justify", lineHeight: "115%" }}>
                  <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           fontFamily: "Arial",
                           color: "rgb(89, 89, 89)",
                           backgroundImage: "initial",
                           backgroundPosition: "initial",
                           backgroundSize: "initial",
                           backgroundRepeat: "initial",
                           backgroundAttachment: "initial",
                           backgroundOrigin: "initial",
                           backgroundClip: "initial",
                        }}
                     >
                        Our services are “commercial items” as defined in Federal Acquisition Regulation (“FAR”) 2.101. If our services are acquired
                        by or on behalf of any agency not within the Department of Defense (“DOD”), our services are subject to the terms of these{" "}
                        <bdt className="block-component" />
                        <bdt className="question">Terms of Service</bdt>
                        <bdt className="statement-end-if-in-editor" /> in accordance with FAR 12.212 (for computer software) and FAR 12.211 (for
                        technical data). If our services are acquired by or on behalf of any agency within the Department of Defense, our services are
                        subject to the terms of these <bdt className="block-component" />
                        <bdt className="question">Terms of Service</bdt>
                        <bdt className="statement-end-if-in-editor" /> in accordance with Defense Federal Acquisition Regulation (“DFARS”) 227.7202-
                     </span>
                     <span style={{ fontSize: 15 }}>
                        <span
                           style={{
                              lineHeight: "115%",
                              fontFamily: "Arial",
                              color: "rgb(89, 89, 89)",
                              backgroundImage: "initial",
                              backgroundPosition: "initial",
                              backgroundSize: "initial",
                              backgroundRepeat: "initial",
                              backgroundAttachment: "initial",
                              backgroundOrigin: "initial",
                              backgroundClip: "initial",
                           }}
                        >
                           3. In addition, DFARS 252.227-
                        </span>
                     </span>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           fontFamily: "Arial",
                           color: "rgb(89, 89, 89)",
                           backgroundImage: "initial",
                           backgroundPosition: "initial",
                           backgroundSize: "initial",
                           backgroundRepeat: "initial",
                           backgroundAttachment: "initial",
                           backgroundOrigin: "initial",
                           backgroundClip: "initial",
                        }}
                     >
                        7015 applies to technical data acquired by the DOD. This U.S. Government Rights clause is in lieu of, and supersedes, any
                        other FAR, DFARS, or other clause or provision that addresses government rights in computer software or technical data under
                        these <bdt className="block-component" />
                        <bdt className="question">Terms of Service</bdt>
                        <bdt className="statement-end-if-in-editor" />.
                     </span>
                  </div>
                  <div className="MsoNormal" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <br />
                  </div>
                  <div className="MsoNormal" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <br />
                  </div>
                  <div className="MsoNormal" style={{ lineHeight: "1.5", textAlign: "left" }}>
                     <span
                        style={{
                           fontSize: "11.0pt",
                           lineHeight: "115%",
                           color: "#595959",
                           msoThemecolor: "text1",
                           msoThemetint: 166,
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="14038561-dad7-be9d-370f-f8aa487b2570">
                           <bdt className="statement-end-if-in-editor" data-type="close">
                              <span style={{ fontSize: 15 }} />
                           </bdt>
                        </bdt>
                     </span>
                  </div>
               </div>
               <div className="MsoNormal" data-custom-class="heading_1" id="sitemanage" style={{ lineHeight: "1.5" }}>
                  <a name="_wj13r09u8u3u" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>13. SITE MANAGEMENT</span>
                  </strong>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     We reserve the right, but not the obligation, to: (1) monitor the Site for violations of these{" "}
                     <bdt className="block-component" />
                     <bdt className="question">Terms of Service</bdt>
                     <bdt className="statement-end-if-in-editor" />; (2) take appropriate legal action against anyone who, in our sole discretion,
                     violates the law or these <bdt className="block-component" />
                     <bdt className="question">Terms of Service</bdt>
                     <bdt className="statement-end-if-in-editor" />, including without limitation, reporting such user to law enforcement authorities;
                     (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the
                     extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without
                     limitation, notice, or liability, to remove from the Site or otherwise disable all files and content that are excessive in size
                     or are in any way burdensome to our systems; and (5) otherwise manage the Site in a manner designed to protect our rights and
                     property and to facilitate the proper functioning of the Site.
                  </span>
               </div>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <a name="_jugvcvcw0oj9" />
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt className="block-component" data-record-question-key="privacy_policy_option" data-type="statement" />
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="heading_1" id="privacypolicy1" style={{ lineHeight: "1.5" }}>
                           <strong>
                              <span
                                 style={{
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    fontSize: 19,
                                 }}
                              >
                                 14. PRIVACY POLICY
                              </span>
                           </strong>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                           <span
                              style={{
                                 fontSize: 15,
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              We care about data privacy and security. Please review our Privacy Policy:{" "}
                              <strong>
                                 <bdt
                                    className="block-container question question-in-editor"
                                    data-id="d10c7fd7-0685-12ac-c717-cbc45ff916d1"
                                    data-type="question"
                                 >
                                    <a href="https://naach.app/privacypolicy" target="_blank" data-custom-class="link">
                                       https://naach.app/privacypolicy
                                    </a>
                                 </bdt>
                              </strong>
                              . By using the Site, you agree to be bound by our Privacy Policy, which is incorporated into these{" "}
                              <bdt className="block-component" />
                              <bdt className="question">Terms of Service</bdt>
                              <bdt className="statement-end-if-in-editor" />. Please be advised the Site is hosted in{" "}
                              <bdt className="block-component" />
                              the <bdt className="question">United States</bdt>
                              <bdt className="block-component" />. If you access the Site from any other region of the world with laws or other
                              requirements governing personal data collection, use, or disclosure that differ from applicable laws in{" "}
                              <span
                                 style={{
                                    fontSize: 15,
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <bdt className="block-component" />
                                 the <bdt className="question">United States</bdt>
                                 <bdt className="block-component" />
                              </span>
                              , then through your continued use of the Site,
                           </span>
                           <span
                              style={{
                                 fontSize: "11.0pt",
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 color: "#595959",
                                 msoThemecolor: "text1",
                                 msoThemetint: 166,
                              }}
                           >
                              &nbsp;
                           </span>
                           <span
                              style={{
                                 fontSize: 15,
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              you are transferring your data to{" "}
                              <span
                                 style={{
                                    fontSize: 15,
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <bdt className="block-component" />
                                 the <bdt className="question">United States</bdt>
                                 <bdt className="block-component" />
                              </span>
                              , and you agree to have your data transferred to and processed in{" "}
                              <span
                                 style={{
                                    fontSize: 15,
                                    lineHeight: "115%",
                                    fontFamily: "Arial",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <bdt className="block-component" />
                                 the <bdt className="question">United States</bdt>
                                 <bdt className="block-component" />
                              </span>
                              . <bdt className="block-component" />
                              <bdt className="block-container if" data-type="if" id="547bb7bb-ecf2-84b9-1cbb-a861dc3e14e7">
                                 <bdt data-type="conditional-block">
                                    <bdt className="block-component" data-record-question-key="user_u13_option" data-type="statement" />
                                 </bdt>
                              </bdt>
                              <bdt className="block-container if" data-type="if" id="547bb7bb-ecf2-84b9-1cbb-a861dc3e14e7">
                                 <bdt data-type="conditional-block">
                                    <bdt data-type="body">
                                       Further, we do not knowingly accept, request, or solicit information from children or knowingly market to
                                       children. Therefore, in accordance with the U.S. Children’s Online Privacy Protection Act, if we receive actual
                                       knowledge that anyone under the age of 13 has provided personal information to us without the requisite and
                                       verifiable parental consent, we will delete that information from the Site
                                    </bdt>
                                 </bdt>
                              </bdt>
                           </span>
                           <span
                              style={{
                                 fontSize: "11.0pt",
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 color: "#595959",
                                 msoThemecolor: "text1",
                                 msoThemetint: 166,
                              }}
                           >
                              <bdt className="block-container if" data-type="if" id="547bb7bb-ecf2-84b9-1cbb-a861dc3e14e7">
                                 <bdt data-type="conditional-block">
                                    <bdt data-type="body">&nbsp;</bdt>
                                 </bdt>
                              </bdt>
                           </span>
                           <span
                              style={{
                                 fontSize: 15,
                                 lineHeight: "115%",
                                 fontFamily: "Arial",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              <bdt className="block-container if" data-type="if" id="547bb7bb-ecf2-84b9-1cbb-a861dc3e14e7">
                                 <bdt data-type="conditional-block">
                                    <bdt data-type="body">as quickly as is reasonably practical.</bdt>
                                 </bdt>
                              </bdt>
                              <bdt className="block-container if" data-type="if" id="547bb7bb-ecf2-84b9-1cbb-a861dc3e14e7">
                                 <bdt className="statement-end-if-in-editor" data-type="close">
                                    <span
                                       style={{
                                          fontSize: 15,
                                          lineHeight: "115%",
                                          fontFamily: "Arial",
                                          color: "rgb(89, 89, 89)",
                                       }}
                                    >
                                       <bdt className="statement-end-if-in-editor" />
                                    </span>
                                 </bdt>
                              </bdt>
                           </span>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <bdt className="block-container if" data-type="if">
                  <bdt className="statement-end-if-in-editor" data-type="close">
                     <span style={{ fontSize: 15 }} />
                  </bdt>
                  <bdt className="block-container if" data-type="if" id="7371467a-f2b5-2aff-cd0f-3379e970551e">
                     <bdt data-type="conditional-block">
                        <bdt
                           className="block-component"
                           data-record-question-key="privacy_policy_followup"
                           data-type="statement"
                           style={{ fontSize: "14.6667px" }}
                        >
                           <bdt className="block-component" />
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="923fc4bc-b171-82ba-b6eb-0a13c12d1b6b">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="copyright_agent_option" data-type="statement" />
                           <bdt className="statement-end-if-in-editor" data-type="close">
                              <span style={{ fontSize: 15 }}>
                                 <bdt className="block-component" />
                              </span>
                           </bdt>
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="95e88984-ac54-be9d-35de-f10fd010af14">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="no_agent_clause_option" data-type="statement" />
                        </bdt>
                        <bdt className="block-component" />
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="heading_1" id="terms" style={{ lineHeight: "1.5" }}>
                  <a name="_k3mndam4w6w1" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>15. TERM AND TERMINATION</span>
                  </strong>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     These <bdt className="block-component" />
                     <bdt className="question">Terms of Service</bdt>
                     <bdt className="statement-end-if-in-editor" /> shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY
                     OTHER PROVISION OF THESE <bdt className="block-component" />
                     <bdt className="question">TERMS OF SERVICE</bdt>
                     <bdt className="statement-end-if-in-editor" />, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY,
                     DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON,
                     INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE{" "}
                     <bdt className="block-component" />
                     <bdt className="question">TERMS OF SERVICE</bdt>
                     <bdt className="statement-end-if-in-editor" /> OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION
                     IN THE SITE OR DELETE{" "}
                     <bdt className="block-container if" data-type="if" id="a6e121c2-36b4-5066-bf9f-a0a33512e768">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="user_account_option" data-type="statement" />
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="a6e121c2-36b4-5066-bf9f-a0a33512e768">
                        <bdt data-type="conditional-block">
                           <bdt data-type="body">YOUR</bdt>
                        </bdt>
                     </bdt>
                  </span>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     <bdt className="block-container if" data-type="if" id="a6e121c2-36b4-5066-bf9f-a0a33512e768">
                        <bdt data-type="conditional-block">
                           <bdt data-type="body">&nbsp;</bdt>
                        </bdt>
                     </bdt>
                  </span>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <bdt className="block-container if" data-type="if" id="a6e121c2-36b4-5066-bf9f-a0a33512e768">
                        <bdt data-type="conditional-block">
                           <bdt data-type="body">ACCOUNT AND&nbsp;</bdt>
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="a6e121c2-36b4-5066-bf9f-a0a33512e768">
                        <bdt className="statement-end-if-in-editor" data-type="close" />
                     </bdt>
                     ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span style={{ fontSize: 15 }}>
                     <span
                        style={{
                           lineHeight: "115%",
                           fontFamily: "Arial",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under
                        your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In
                        addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without
                        limitation pursuing civil, criminal, and injunctive redress.
                     </span>
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" data-custom-class="heading_1" id="modifications" style={{ lineHeight: "1.5" }}>
                  <a name="_e2dep1hfgltt" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial" }}>
                        <span style={{ fontSize: 19 }}>16. MODIFICATIONS AND INTERRUPTIONS</span>
                     </span>
                  </strong>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion
                     without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or
                     discontinue all or part of the Site without notice at any time. We will not be liable to you or any third party for any
                     modification, price change, suspension, or discontinuance of the Site.
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: 1 }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     We cannot guarantee the Site will be available at all times. We may experience hardware, software, or other problems or need to
                     perform maintenance related to the Site, resulting in interruptions, delays, or errors. We reserve the right to change, revise,
                     update, suspend, discontinue, or otherwise modify the Site at any time or for any reason without notice to you. You agree that we
                     have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Site during any
                     downtime or discontinuance of the Site. Nothing in these <bdt className="block-component" />
                     <bdt className="question">Terms of Service</bdt>
                     <bdt className="statement-end-if-in-editor" /> will be construed to obligate us to maintain and support the Site or to supply any
                     corrections, updates, or releases in connection therewith.
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" data-custom-class="heading_1" id="law" style={{ lineHeight: "1.5" }}>
                  <a name="_p6vbf8atcwhs" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial" }}>
                        <span style={{ fontSize: 19 }}>17. GOVERNING LAW</span>
                     </span>
                  </strong>
               </div>
               <div className="MsoNormal" style={{ lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     <bdt className="block-component" />
                  </span>
               </div>
               <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     These <bdt className="block-component" />
                     <bdt className="question">Terms of Service</bdt>
                     <bdt className="statement-end-if-in-editor" /> and your use of the Site are governed by and construed in accordance with the laws
                     of{" "}
                     <bdt className="block-container if" data-type="if" id="b86653c1-52f0-c88c-a218-e300b912dd6b">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="governing_law" data-type="statement" />
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="b86653c1-52f0-c88c-a218-e300b912dd6b">
                        <bdt data-type="conditional-block">
                           <bdt data-type="body">the State</bdt>
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="b86653c1-52f0-c88c-a218-e300b912dd6b">
                        <bdt data-type="conditional-block">
                           <bdt data-type="body">&nbsp;of&nbsp;</bdt>
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="b86653c1-52f0-c88c-a218-e300b912dd6b">
                        <bdt data-type="conditional-block">
                           <bdt data-type="body">
                              <bdt
                                 className="block-container question question-in-editor"
                                 data-id="b61250bd-6b61-32ea-a9e7-4a02690297c3"
                                 data-type="question"
                              >
                                 Michigan
                              </bdt>
                           </bdt>
                        </bdt>
                     </bdt>
                     <bdt className="block-container if" data-type="if" id="b86653c1-52f0-c88c-a218-e300b912dd6b">
                        <bdt className="statement-end-if-in-editor" data-type="close" />
                     </bdt>
                  </span>
                  <span
                     style={{
                        fontSize: "11.0pt",
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "#595959",
                        msoThemecolor: "text1",
                        msoThemetint: 166,
                     }}
                  >
                     &nbsp;
                  </span>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     applicable to agreements made and to be entirely performed within{" "}
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           fontFamily: "Arial",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="b86653c1-52f0-c88c-a218-e300b912dd6b">
                           <bdt data-type="conditional-block">
                              <bdt className="block-component" data-record-question-key="governing_law" data-type="statement" />
                           </bdt>
                        </bdt>
                        <bdt
                           className="block-container if"
                           data-type="if"
                           id="b86653c1-52f0-c88c-a218-e300b912dd6b"
                           style={{ fontSize: "14.6667px" }}
                        >
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">the State of</bdt>
                           </bdt>
                        </bdt>
                        <bdt
                           className="block-container if"
                           data-type="if"
                           id="b86653c1-52f0-c88c-a218-e300b912dd6b"
                           style={{ fontSize: "14.6667px" }}
                        >
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">&nbsp;</bdt>
                           </bdt>
                        </bdt>
                        <bdt
                           className="block-container if"
                           data-type="if"
                           id="b86653c1-52f0-c88c-a218-e300b912dd6b"
                           style={{ fontSize: "14.6667px" }}
                        >
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">
                                 <bdt
                                    className="block-container question question-in-editor"
                                    data-id="b61250bd-6b61-32ea-a9e7-4a02690297c3"
                                    data-type="question"
                                 >
                                    Michigan
                                 </bdt>
                              </bdt>
                           </bdt>
                        </bdt>
                        <bdt
                           className="block-container if"
                           data-type="if"
                           id="b86653c1-52f0-c88c-a218-e300b912dd6b"
                           style={{ fontSize: "14.6667px" }}
                        >
                           <bdt className="statement-end-if-in-editor" data-type="close" />
                        </bdt>
                        , without regard to its conflict of law principles.
                     </span>
                     <bdt className="block-component" />
                  </span>
               </div>
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <br />
            </div>
            <div align="center" style={{ textAlign: "left", lineHeight: "1.5" }}>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <br />
               </div>
               <div className="MsoNormal" data-custom-class="heading_1" id="disputes" style={{ lineHeight: "1.5" }}>
                  <a name="_v5i5tjw62cyw" />
                  <strong>
                     <span style={{ lineHeight: "115%", fontFamily: "Arial", fontSize: 19 }}>18. DISPUTE RESOLUTION</span>
                  </strong>
               </div>
               <div className="MsoNormal" style={{ lineHeight: 1 }}>
                  <br />
               </div>
               <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                  <bdt className="block-container if" data-type="if">
                     <bdt data-type="conditional-block">
                        <bdt className="block-component" />
                     </bdt>
                  </bdt>
               </div>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
                           <bdt className="block-component" />
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
               <bdt className="block-container if" data-type="if">
                  <bdt data-type="conditional-block">
                     <bdt data-type="body">
                        <div className="MsoNormal" data-custom-class="heading_2" style={{ lineHeight: "1.5" }}>
                           <span
                              style={{
                                 fontSize: 15,
                                 lineHeight: "16.8667px",
                                 color: "rgb(89, 89, 89)",
                              }}
                           >
                              <strong>Binding Arbitration</strong>
                           </span>
                        </div>
                     </bdt>
                  </bdt>
               </bdt>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span style={{ fontSize: 15 }} />
               </bdt>
               <span style={{ fontSize: 15 }}>
                  If{" "}
                  <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                     the Parties are unable to resolve a Dispute through informal negotiations, the Dispute (except those Disputes expressly excluded
                     below) will be finally and exclusively resolved by binding arbitration. YOU UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD
                     HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL. The arbitration shall be commenced and conducted under the Commercial
                     Arbitration Rules of the American Arbitration Association ("AAA") and, where appropriate, the AAA’s Supplementary Procedures for
                     Consumer Related Disputes ("AAA Consumer Rules"), both of which are available at the AAA website{" "}
                     <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                        <a data-custom-class="link" href="http://www.adr.org" rel="noopener noreferrer" target="_blank">
                           www.adr.org
                        </a>
                     </span>
                     . Your arbitration fees and your share of arbitrator compensation shall be governed by the AAA Consumer Rules and, where
                     appropriate, limited by the AAA Consumer Rules.
                     <bdt className="block-container if" data-type="if" id="6777bc44-5ef4-6fac-ab8d-a10de36d54f9" style={{ fontSize: "14.6667px" }}>
                        <bdt data-type="conditional-block">
                           &nbsp;
                           <bdt className="block-component" data-record-question-key="artitration_fee_option" data-type="statement" />
                           The arbitration may be conducted in person, through the submission of documents, by phone, or online. The arbitrator will
                           make a decision in writing, but need not provide a statement of reasons unless requested by either Party. The arbitrator
                           must follow applicable law, and any award may be challenged if the arbitrator fails to do so. Except where otherwise
                           required by the applicable AAA rules or applicable law, the arbitration will take place in
                           <bdt className="block-component" />{" "}
                           <bdt
                              className="block-container question question-in-editor"
                              data-id="e0454973-d288-7862-452e-772c9f275b5c"
                              data-type="question"
                              style={{ fontSize: "14.6667px" }}
                           >
                              Oakland
                           </bdt>
                           ,
                           <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                              <bdt className="statement-end-if-in-editor" />
                           </span>{" "}
                           <bdt className="block-component" />
                        </bdt>
                     </bdt>
                  </span>
               </span>
               <span
                  style={{
                     fontSize: 15,
                     lineHeight: "16.8667px",
                     color: "rgb(89, 89, 89)",
                  }}
               >
                  <bdt
                     className="block-container question question-in-editor"
                     data-id="632c5ff4-8ec5-86c3-d282-b9e06cf62215"
                     data-type="question"
                     style={{ fontSize: "14.6667px" }}
                  >
                     Michigan
                  </bdt>
                  <span style={{ lineHeight: "16.8667px", color: "rgb(89, 89, 89)" }}>
                     <bdt className="statement-end-if-in-editor" />
                  </span>
                  . Except as otherwise provided herein, the Parties may litigate in court to compel arbitration, stay proceedings pending
                  arbitration, or to confirm, modify, vacate, or enter judgment on the award entered by the arbitrator.
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span
                  style={{
                     fontSize: 15,
                     lineHeight: "16.8667px",
                     color: "rgb(89, 89, 89)",
                  }}
               >
                  If{" "}
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "16.8667px",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     for any reason, a Dispute proceeds in court rather than arbitration, the Dispute shall be commenced or prosecuted in the
                     <bdt className="block-component" /> state and federal courts
                     <bdt className="statement-end-if-in-editor" />
                     &nbsp;
                  </span>
                  <span
                     style={{
                        fontSize: "11pt",
                        lineHeight: "16.8667px",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <span style={{ fontSize: 15 }}>
                        located in
                        <bdt className="block-component" />
                     </span>
                  </span>{" "}
                  <bdt className="block-component" />
               </span>
               <span
                  style={{
                     fontSize: 15,
                     lineHeight: "16.8667px",
                     color: "rgb(89, 89, 89)",
                  }}
               >
                  <bdt className="block-container question question-in-editor" data-id="3bd73ec6-6e8a-3b4d-c1dd-08b50e9cc8cc" data-type="question">
                     Michigan
                  </bdt>
                  <span
                     style={{
                        fontSize: "11pt",
                        lineHeight: "16.8667px",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <span style={{ fontSize: 15 }}>
                        <bdt className="statement-end-if-in-editor" />
                     </span>
                  </span>
                  , and the Parties hereby consent to, and waive all defenses of lack of personal jurisdiction, and forum non conveniens with respect
                  to venue and jurisdiction in such
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "16.8667px",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <bdt className="block-component" /> state and federal courts
                     <bdt className="statement-end-if-in-editor" />
                  </span>
                  . Application of the United Nations Convention on Contracts for the International Sale of Goods and the Uniform Computer Information
                  Transaction Act (UCITA) are excluded from these <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" />.
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span
                  style={{
                     fontSize: 15,
                     lineHeight: "16.8667px",
                     color: "rgb(89, 89, 89)",
                  }}
               >
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "16.8667px",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <bdt className="block-component" /> If this provision is found to be illegal or unenforceable, then neither Party will elect to
                     arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall
                     be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit
                     to the personal jurisdiction of that court.
                     <bdt className="block-component" />
                  </span>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_2" style={{ lineHeight: "1.5" }}>
               <strong>Restrictions</strong>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent
                  permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute
                  to be arbitrated on a class-action basis or to utilize class action procedures; and (c) there is no right or authority for any
                  Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_2" style={{ lineHeight: "1.5" }}>
               <bdt className="block-component">
                  <span style={{ fontSize: 15 }}>
                     <strong />
                  </span>
               </bdt>
               <span style={{ fontSize: 15 }}>
                  <strong>
                     Exceptions to Arbitration
                     <bdt className="else-block" />
                  </strong>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  <bdt className="block-component" />
                  The{" "}
                  <span style={{ fontSize: 15, lineHeight: "115%", color: "rgb(89, 89, 89)" }}>
                     Parties agree that the following Disputes are not subject to the above provisions concerning binding arbitration: (a) any
                     Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b)
                     any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any
                     claim for injunctive relief. If this provision is found to be illegal or unenforceable, then neither Party will elect to
                     arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall
                     be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit
                     to the personal jurisdiction of that court.
                     <bdt className="else-block" />
                  </span>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  <span style={{ fontSize: 15, lineHeight: "115%", color: "rgb(89, 89, 89)" }}>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        <bdt className="statement-end-if-in-editor">
                           <span style={{ fontSize: 15 }}>
                              <span
                                 style={{
                                    fontSize: 15,
                                    lineHeight: "115%",
                                    color: "rgb(89, 89, 89)",
                                 }}
                              >
                                 <span
                                    style={{
                                       fontSize: 15,
                                       lineHeight: "115%",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <bdt className="statement-end-if-in-editor" />
                                 </span>
                              </span>
                           </span>
                        </bdt>
                     </span>
                  </span>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="corrections" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ fontSize: 19 }}>19. CORRECTIONS</span>
               </strong>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  There may be information on the Site that contains typographical errors, inaccuracies, or omissions, including descriptions,
                  pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to
                  change or update the information on the Site at any time, without prior notice.
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="disclaimer" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ fontSize: 19 }}>20. DISCLAIMER</span>
               </strong>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE
                  RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR
                  USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                  NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SITE’S CONTENT OR THE CONTENT
                  OF ANY WEBSITES LINKED TO THE SITE AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES
                  OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF
                  THE SITE, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL
                  INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SITE, (5) ANY BUGS, VIRUSES, TROJAN
                  HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY
                  CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR
                  OTHERWISE MADE AVAILABLE VIA THE SITE. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE
                  ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SITE, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN
                  ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN
                  YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY
                  ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="liability" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ fontSize: 19 }}>21. LIMITATIONS OF LIABILITY</span>
               </strong>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  IN{" "}
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT,
                     CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER
                     DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.{" "}
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           fontFamily: "Arial",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                           <bdt data-type="conditional-block">
                              <bdt className="block-component" data-record-question-key="limitations_liability_option" data-type="statement" />
                           </bdt>
                        </bdt>
                        <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">NOTWITHSTANDING</bdt>
                           </bdt>
                        </bdt>
                     </span>
                     <span
                        style={{
                           fontSize: "11.0pt",
                           lineHeight: "115%",
                           fontFamily: "Arial",
                           color: "#595959",
                           msoThemecolor: "text1",
                           msoThemetint: 166,
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">&nbsp;</bdt>
                           </bdt>
                        </bdt>
                     </span>
                     <span
                        style={{
                           fontSize: 15,
                           lineHeight: "115%",
                           fontFamily: "Arial",
                           color: "rgb(89, 89, 89)",
                        }}
                     >
                        <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                           <bdt data-type="conditional-block">
                              <bdt data-type="body">
                                 ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM
                                 OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO{" "}
                                 <span
                                    style={{
                                       fontSize: 15,
                                       lineHeight: "115%",
                                       fontFamily: "Arial",
                                       color: "rgb(89, 89, 89)",
                                    }}
                                 >
                                    <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                                       <bdt data-type="conditional-block">
                                          <bdt data-type="body">
                                             <bdt className="block-container if" data-type="if" id="73189d93-ed3a-d597-3efc-15956fa8e04e">
                                                <bdt data-type="conditional-block">
                                                   <bdt
                                                      className="block-component"
                                                      data-record-question-key="limitations_liability_option"
                                                      data-type="statement"
                                                   />
                                                </bdt>
                                             </bdt>
                                          </bdt>
                                       </bdt>
                                    </bdt>
                                 </span>
                                 <bdt data-type="if">
                                    <bdt data-type="conditional-block">
                                       <bdt data-type="body">
                                          <bdt data-type="if">
                                             <bdt data-type="conditional-block">
                                                <bdt data-type="body">THE AMOUNT PAID,</bdt>
                                             </bdt>
                                          </bdt>
                                       </bdt>
                                    </bdt>
                                 </bdt>
                                 <bdt data-type="if">
                                    &nbsp;
                                    <bdt data-type="conditional-block">
                                       <bdt data-type="body">
                                          <bdt data-type="if">
                                             <bdt data-type="conditional-block">
                                                <bdt data-type="body">
                                                   IF ANY, BY YOU TO US
                                                   <span
                                                      style={{
                                                         fontSize: 15,
                                                         lineHeight: "115%",
                                                         fontFamily: "Arial",
                                                         color: "rgb(89, 89, 89)",
                                                      }}
                                                   >
                                                      <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                                                         <bdt data-type="conditional-block">
                                                            <bdt data-type="body">
                                                               <bdt
                                                                  className="block-container if"
                                                                  data-type="if"
                                                                  id="73189d93-ed3a-d597-3efc-15956fa8e04e"
                                                               >
                                                                  <bdt data-type="conditional-block">
                                                                     <bdt data-type="body">
                                                                        <bdt
                                                                           className="block-container if"
                                                                           data-type="if"
                                                                           id="19e172cb-4ccf-1904-7c06-4251800ba748"
                                                                        >
                                                                           <bdt data-type="conditional-block">
                                                                              <bdt
                                                                                 className="block-component"
                                                                                 data-record-question-key="limilation_liability_time_option"
                                                                                 data-type="statement"
                                                                              />
                                                                           </bdt>
                                                                        </bdt>
                                                                     </bdt>
                                                                  </bdt>
                                                               </bdt>
                                                            </bdt>
                                                         </bdt>
                                                      </bdt>
                                                   </span>{" "}
                                                   DURING THE <bdt className="question">SIX (6)</bdt> MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION
                                                   ARISING
                                                   <span
                                                      style={{
                                                         fontSize: 15,
                                                         lineHeight: "115%",
                                                         fontFamily: "Arial",
                                                         color: "rgb(89, 89, 89)",
                                                      }}
                                                   >
                                                      <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                                                         <bdt data-type="conditional-block">
                                                            <bdt data-type="body">
                                                               <bdt
                                                                  className="block-container if"
                                                                  data-type="if"
                                                                  id="73189d93-ed3a-d597-3efc-15956fa8e04e"
                                                               >
                                                                  <bdt data-type="conditional-block">
                                                                     <bdt data-type="body">
                                                                        <bdt
                                                                           className="block-container if"
                                                                           data-type="if"
                                                                           id="19e172cb-4ccf-1904-7c06-4251800ba748"
                                                                        >
                                                                           <bdt className="statement-end-if-in-editor" data-type="close" />
                                                                        </bdt>
                                                                     </bdt>
                                                                  </bdt>
                                                               </bdt>
                                                            </bdt>
                                                         </bdt>
                                                      </bdt>
                                                      <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                                                         <bdt data-type="conditional-block">
                                                            <bdt data-type="body">
                                                               <bdt
                                                                  className="block-container if"
                                                                  data-type="if"
                                                                  id="73189d93-ed3a-d597-3efc-15956fa8e04e"
                                                               >
                                                                  <bdt data-type="conditional-block">
                                                                     <bdt
                                                                        className="block-component"
                                                                        data-record-question-key="limitations_liability_option"
                                                                        data-type="statement"
                                                                     />
                                                                  </bdt>
                                                               </bdt>
                                                            </bdt>
                                                         </bdt>
                                                      </bdt>
                                                   </span>
                                                   .{" "}
                                                   <span
                                                      style={{
                                                         fontSize: 15,
                                                         lineHeight: "115%",
                                                         fontFamily: "Arial",
                                                         color: "rgb(89, 89, 89)",
                                                      }}
                                                   >
                                                      <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                                                         <bdt data-type="conditional-block">
                                                            <bdt data-type="body">
                                                               CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED
                                                               WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO
                                                               YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU
                                                               MAY HAVE ADDITIONAL RIGHTS.
                                                            </bdt>
                                                         </bdt>
                                                      </bdt>
                                                      <bdt className="block-container if" data-type="if" id="3c3071ce-c603-4812-b8ca-ac40b91b9943">
                                                         <bdt className="statement-end-if-in-editor" data-type="close" />
                                                      </bdt>
                                                   </span>
                                                </bdt>
                                             </bdt>
                                          </bdt>
                                       </bdt>
                                    </bdt>
                                 </bdt>
                              </bdt>
                           </bdt>
                        </bdt>
                     </span>
                  </span>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="indemnification" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ fontSize: 19 }}>22. INDEMNIFICATION</span>
               </strong>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers,
                  agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’
                  fees and expenses, made by any third party due to or arising out of:{" "}
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <bdt className="block-container if" data-type="if" id="475fffa5-05ca-def8-ac88-f426b238903c">
                        <bdt data-type="conditional-block">
                           <bdt className="block-component" data-record-question-key="user_post_content_option" data-type="statement" />
                        </bdt>
                     </bdt>
                  </span>
                  <bdt data-type="if">
                     <bdt data-type="conditional-block">
                        <bdt data-type="body">(1) your Contributions;</bdt>
                     </bdt>
                  </bdt>
                  <bdt data-type="if">&nbsp;</bdt>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <bdt className="block-container if" data-type="if" id="475fffa5-05ca-def8-ac88-f426b238903c">
                        <bdt className="statement-end-if-in-editor" data-type="close" />
                     </bdt>
                  </span>
                  (2) use of the Site; (3) breach of these <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" />; (4) any breach of your representations and warranties set forth in these{" "}
                  <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" />; (5) your violation of the rights of a third party, including but not limited to
                  intellectual property rights; or (6) any overt harmful act toward any other user of the Site with whom you connected via the Site.
                  Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for
                  which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use
                  reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming
                  aware of it.
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="userdata" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ fontSize: 19 }}>23. USER DATA</span>
               </strong>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  We will maintain certain data that you transmit to the Site for the purpose of managing the performance of the Site, as well as data
                  relating to your use of the Site. Although we perform regular routine backups of data, you are solely responsible for all data that
                  you transmit or that relates to any activity you have undertaken using the Site. You agree that we shall have no liability to you
                  for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or
                  corruption of such data.
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="electronic" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 19 }}>
                  <strong>24. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</strong>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  Visiting{" "}
                  <span
                     style={{
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     the Site, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic
                     communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you
                     electronically, via email and on the Site, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE
                     TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND
                     RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SITE. You hereby waive any rights or requirements under any
                     statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or
                     retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.
                  </span>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <bdt className="block-component" />
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="california" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 19 }}>
                  <strong>25. CALIFORNIA USERS AND RESIDENTS</strong>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer
                  Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California
                  95834 or by telephone at (800) 952-5210 or (916) 445-1254.
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  <bdt className="statement-end-if-in-editor" />
               </span>
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="misc" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ fontSize: 19 }}>26. MISCELLANEOUS</span>
               </strong>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  These <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" /> and any policies or operating rules posted by us on the Site or in respect to the
                  Site constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision
                  of these <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" /> shall not operate as a waiver of such right or provision. These{" "}
                  <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" /> operate to the fullest extent permissible by law. We may assign any or all of our
                  rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act
                  caused by any cause beyond our reasonable control. If any provision or part of a provision of these{" "}
                  <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" /> is determined to be unlawful, void, or unenforceable, that provision or part of the
                  provision is deemed severable from these <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" /> and does not affect the validity and enforceability of any remaining provisions.
                  There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these{" "}
                  <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" /> or use of the Site. You agree that these <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" /> will not be construed against us by virtue of having drafted them. You hereby waive
                  any and all defenses you may have based on the electronic form of these <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" /> and the lack of signing by the parties hereto to execute these{" "}
                  <bdt className="block-component" />
                  <bdt className="question">Terms of Service</bdt>
                  <bdt className="statement-end-if-in-editor" />.
                  <bdt className="block-component" />
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.5" }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="heading_1" id="contact" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 19 }}>
                  <strong>27. CONTACT US</strong>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: "1.1" }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  In o
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     rder to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                  </span>
               </span>
            </div>
            <div className="MsoNormal" style={{ lineHeight: 1 }}>
               <br />
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <bdt className="question">
                        <strong>Naach</strong>
                     </bdt>
                  </span>
               </span>
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <span style={{ fontSize: 15 }}>
                  <span
                     style={{
                        fontSize: 15,
                        lineHeight: "115%",
                        fontFamily: "Arial",
                        color: "rgb(89, 89, 89)",
                     }}
                  >
                     <strong>
                        <span style={{ color: "rgb(89, 89, 89)" }}>
                           <bdt className="question">__________</bdt>
                           <strong>
                              <span style={{ color: "rgb(89, 89, 89)" }}>
                                 <span style={{ fontSize: 15 }}>
                                    <bdt className="block-component" />
                                 </span>
                              </span>
                           </strong>
                        </span>
                     </strong>
                  </span>
               </span>
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ color: "rgb(89, 89, 89)" }}>
                     <span style={{ fontSize: 15 }}>
                        <bdt className="question">__________</bdt>
                        <strong>
                           <span style={{ color: "rgb(89, 89, 89)" }}>
                              <span style={{ fontSize: 15 }}>
                                 <bdt className="block-component" />
                              </span>
                           </span>
                        </strong>
                        <span style={{ fontSize: 15 }}>
                           <strong>
                              <span style={{ color: "rgb(89, 89, 89)" }}>
                                 <bdt className="block-component" />
                              </span>
                           </strong>
                           <strong>
                              <span style={{ color: "rgb(89, 89, 89)" }}>
                                 <bdt className="block-component" />
                              </span>
                           </strong>
                        </span>
                     </span>
                  </span>
               </strong>
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ fontSize: 15 }}>
                     <bdt className="block-component" />
                     Phone: <bdt className="question">2486868886</bdt>
                     <bdt className="statement-end-if-in-editor" />
                  </span>
               </strong>
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <strong>
                  <span style={{ fontSize: 15 }}>
                     <bdt className="block-component" />
                  </span>
               </strong>
            </div>
            <div className="MsoNormal" data-custom-class="body_text" style={{ lineHeight: "1.5" }}>
               <bdt className="question">
                  <strong>
                     <span style={{ fontSize: 15 }}>contact@naach.app</span>
                  </strong>
               </bdt>
            </div>
         </div>
         <style
            dangerouslySetInnerHTML={{
               __html:
                  "\n      ul {\n        list-style-type: square;\n      }\n      ul > li > ul {\n        list-style-type: circle;\n      }\n      ul > li > ul > li > ul {\n        list-style-type: square;\n      }\n      ol li {\n        font-family: Arial ;\n      }\n    ",
            }}
         />
      </article>
   );
};

export default privacy;
