import * as React from "react";

interface EmailTemplateProps {
   firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ firstName }) => (
   <div>
      {firstName ? <p>Hi {firstName}!</p> : <p>Hi there!</p>}
      <div>I wanted to open up a line of communication between us so that you're comfortable reaching out with ideas to make FORMI better.</div>
      <br />
      <div>We're rolling out new features daily and I'd love to hear your first impressions / if we could be doing anything better?</div>
      <br />
      <div>Best,</div>
      <div>Kishan Sripada, CEO</div>
      <div>https://formistudio.app</div>
   </div>
);

export default EmailTemplate;
