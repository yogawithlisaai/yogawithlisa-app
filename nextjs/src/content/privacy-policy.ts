/**
 * Single source of truth for the /privacy page's copy. Update the policy by editing
 * this file only — nothing else references the text directly. The canonical version
 * of this policy lives at https://www.yogawithlisa.ai/privacy.html; keep the two in sync.
 */

export const privacyPolicyLastUpdated = "September 20, 2026";

export const privacyPolicyIntro =
  'This Privacy Policy describes how Yoga with Lisa by Lisa Eshun-Wilson & Associates, LLC ("Yoga with Lisa," "we," "us," or "our") collects, uses, and shares information about you.';

interface Paragraph {
  type: "paragraph";
  /** Optional bold lead-in phrase, e.g. "Directly from you." */
  lead?: string;
  text: string;
}

interface List {
  type: "list";
  items: string[];
}

type Block = Paragraph | List;

function p(text: string, lead?: string): Paragraph {
  return { type: "paragraph", text, lead };
}

function list(items: string[]): List {
  return { type: "list", items };
}

export interface PrivacyPolicySubsection {
  heading: string;
  blocks: Block[];
}

export interface PrivacyPolicySection {
  heading: string;
  blocks?: Block[];
  subsections?: PrivacyPolicySubsection[];
}

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    heading: "What This Policy Covers",
    blocks: [
      p("This policy applies to information we collect when you use:"),
      list([
        "Our marketing website at yogawithlisa.ai;",
        "Our member platform at app.yogawithlisa.ai, which includes the on-demand class library, the recipe library, and the MindShift practice journal;",
        "Our in-person and private session bookings, corporate wellness programs, and student wellness programs; or",
        'Any other interaction with us described below (collectively, the "Site" and "Services").',
      ]),
      p(
        "We may change this Privacy Policy from time to time. If we make material changes, we will notify you by email to the primary email address you have provided to us and/or through a notice on our Site. We encourage you to review this Privacy Policy whenever you interact with us. The date this Policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date, active, and deliverable email address for you, and for periodically visiting the Site and this Policy to check for any changes.",
      ),
    ],
  },
  {
    heading: "Acceptance of These Terms",
    blocks: [
      p(
        "By using this Site on any computer, mobile phone, tablet, or other device, purchasing a class package or membership, or otherwise interacting with the Site, you signify your acceptance of this policy and any changes to it. If you do not agree to this policy, please do not use our Site.",
      ),
    ],
  },
  {
    heading: "When Do We Collect Your Information?",
    blocks: [
      p("We collect information relating to you and your use of the Site and Services in order to provide features that are responsive to your needs. We collect personal information in the following ways:"),
      p(
        "We collect information from you when you register an account, purchase a class package or membership, book a private session or retreat, submit content or information to the Site, fill out a form, complete a survey, request information, send us an email or other communication, or otherwise interact with us or the Site or Services.",
        "Directly from you.",
      ),
      p(
        'If you choose to create an account or sign in using Google, we receive certain information from Google as described in the "Signing In with Google" section below.',
        "From third-party sign-in providers.",
      ),
      p(
        "We may receive information about you from our third-party partners and service providers who help us provide services to you, including payment processors, scheduling providers, and email delivery services.",
        "From other third-party sources.",
      ),
      p(
        "Information collected automatically as you use and navigate the Site may include usage details, IP address, and information collected through cookies and other tracking technologies.",
        "Automatically as you navigate the Site.",
      ),
    ],
  },
  {
    heading: "What Information Do We Collect?",
    subsections: [
      {
        heading: "Information You Provide to Us",
        blocks: [
          p(
            "We collect the information you provide directly to us when you access and use the Site and Services, including but not limited to your: first and last name; email address; phone number; billing address; company name and job title (for corporate wellness clients); account information including username and password; wellness goals and preferences; payment information; form or survey responses; and any other content or information you provide to us or submit to or store within the Site.",
          ),
        ],
      },
      {
        heading: "Signing In with Google",
        blocks: [
          p("Our member platform offers the option to create an account or sign in using your Google account. If you choose this option, Google asks for your permission and then provides us with the following information from your Google profile:"),
          list(["Your name;", "Your email address; and", "Your Google profile picture."]),
          p(
            "We use this information solely to create and authenticate your account, to identify you when you return, and to contact you about your account. We do not receive, and never have access to, your Google password. We do not request access to your Gmail, Google Drive, Google Calendar, Google Contacts, or any other Google service, and we do not read, store, or process the contents of any Google product.",
          ),
          p(
            "Our use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. Specifically, we do not use Google user data to serve advertising, we do not sell or transfer Google user data to third parties except as necessary to provide and secure our Services, to comply with applicable law, or as part of a merger or acquisition, and we do not allow humans to read Google user data except with your explicit consent, for security purposes, to comply with applicable law, or where the data has been aggregated and de-identified.",
            "Limited Use.",
          ),
          p(
            'You may revoke our access to your Google account at any time from your Google Account permissions page (myaccount.google.com/permissions). Revoking access prevents future sign-in with Google but does not automatically delete the account or content you have created with us. To delete that, see "Deleting Your Account and Information" below.',
          ),
        ],
      },
      {
        heading: "Practice and Wellness Content You Create",
        blocks: [
          p(
            "If you use MindShift, our practice journal, we store the entries, reflections, and practice logs you choose to create, along with the dates and times you created them. You control this content and can delete individual entries or your entire account at any time.",
          ),
        ],
      },
      {
        heading: "Information Sent to Us by Web Browsers",
        blocks: [
          p(
            "We and our third-party service providers collect information sent to us automatically by your web browser or device. This information may include your IP address, the identity of your Internet service provider, the name and version of your operating system, the name and version of your browser, the date and time of your visit, the pages you visit, the length of your visit, and the websites you visit before coming to and after leaving the Site. This information is not, in and of itself, personally identifiable. Generally, we use this information in the aggregate to help us improve the Site. However, we may combine it with other information in an attempt to identify you, or we may combine it with information that does identify you.",
          ),
        ],
      },
      {
        heading: "Information Collected by Cookies and Other Technologies",
        blocks: [
          p(
            "We use cookies and similar technologies to collect information and support certain features of the Site. Cookies are identifiers we transfer to your device that allow us to recognize your device and tell us how and when pages and features in our Site and Services are visited and by how many people. On our member platform, we use strictly necessary cookies to keep you signed in and to maintain the security of your session; the Site will not function correctly without them. On our marketing website, we also use analytics cookies as described below. Most web browsers automatically accept cookies, but you can change your browser settings to disable all or certain cookies. Please be aware that disabling cookies may prevent you from taking advantage of some features on the Site.",
          ),
        ],
      },
    ],
  },
  {
    heading: "How Do We Use Your Information?",
    blocks: [
      p("We process information in order to provide the Site and Services to you and to communicate with you. Generally, we use the information we collect to:"),
      p(
        "Provide and improve your online class and wellness experience; create and authenticate your account; deliver the video classes, recipes, and journal features you have access to; process transactions and send confirmations and receipts; respond to your questions and provide customer support; communicate with you about classes, schedules, memberships, retreats, wellness programs, and promotions; manage your account and send technical notices, updates, and security alerts; personalize your experience and provide content that matches your interests; monitor and analyze usage trends and conduct research to improve the Site and Services; manage risk and protect the Site and Services by helping to detect and prevent fraud and abuse; develop new programs and services; maintain our records; comply with contractual, legal, and regulatory obligations; and carry out any other purpose for which you provide your consent or which can be inferred from the circumstances of collection.",
      ),
      p(
        "We do not use your personal information to train artificial intelligence or machine learning models, and we do not permit our service providers to use your content to train their models.",
      ),
    ],
    subsections: [
      {
        heading: "Text and Email Communications",
        blocks: [
          p(
            "With your permission, we may send you text messages and emails about class schedules, new content, wellness tips, membership updates, and promotions. You may opt out at any time by replying STOP to any text message or following the unsubscribe instructions in any email. You cannot opt out of emails related to your account registration, security, or transactions with the Site.",
          ),
        ],
      },
    ],
  },
  {
    heading: "Do We Disclose Any Information to Outside Parties?",
    blocks: [p("We do not sell, trade, or transfer your personal information to third parties, except in the circumstances described below.")],
    subsections: [
      {
        heading: "Third-Party Service Providers",
        blocks: [
          p(
            "We rely on the following service providers to operate the Site and Services. Each processes only the information needed to perform its function, and each is responsible for its own compliance with applicable data protection laws.",
          ),
          list([
            "Supabase stores our member accounts and database, including your name, email address, account credentials, and any practice journal content you create.",
            "Google provides the optional sign-in described above, and provides analytics on our marketing website.",
            "Vercel hosts our member platform and processes standard server request information, including IP addresses.",
            "Cloudflare stores and delivers our class video files and images.",
            "Anthropic processes the messages you send within MindShift in order to generate responses. Your messages are sent to Anthropic's API to produce a reply and are not used to train their models.",
            "Email and messaging providers deliver account confirmations, password resets, and, where you have opted in, reminders and updates.",
            "Scheduling and payment providers handle session bookings and process payments. We do not store full payment card numbers on our systems.",
          ]),
          p("Our online service providers may implement technologies that allow for the collection of personally identifiable information over time and across websites."),
        ],
      },
      {
        heading: "Legal Requirements and Business Transfers",
        blocks: [
          p(
            "We may disclose your information: (i) if we are required to do so by law, legal process, statute, rule, regulation, or professional standard, or to respond to a subpoena, search warrant, or other government official request; (ii) when we believe disclosure is necessary or appropriate to prevent physical harm or financial loss; (iii) in connection with an investigation of a complaint, security threat, or suspected or actual illegal activity; (iv) in connection with an internal audit; or (v) in the event that we are subject to mergers, acquisitions, joint ventures, sales of assets, reorganizations, divestitures, dissolutions, bankruptcies, liquidations, or other types of business transactions. In these types of transactions, your information, including personal information, may be shared, sold, or transferred and may be used subsequently by a third party.",
          ),
        ],
      },
      {
        heading: "Aggregated Information",
        blocks: [p("We may share aggregated or de-identified information, which cannot reasonably be used to identify you, without restriction.")],
      },
    ],
  },
  {
    heading: "Your Information Choices and Controls",
    blocks: [
      p(
        "You may correct, update, or delete your account information at any time. You may change your subscription or notification preferences. You may request access to the personal information we hold about you and ask that we amend or delete it. You can exercise these controls through the Site or by emailing contact@yogawithlisa.ai.",
      ),
    ],
    subsections: [
      {
        heading: "Deleting Your Account and Information",
        blocks: [
          p(
            'You may delete your account and the personal information associated with it at any time. To do so, email contact@yogawithlisa.ai from the address associated with your account with the subject line "Delete My Account." We will confirm your request and complete the deletion within 30 days.',
          ),
          p(
            "Deletion removes your account record, your name and email address, your practice journal entries, and your preferences from our active systems. Residual copies may persist in encrypted backups for a limited period before being overwritten in the ordinary course. We may retain a minimal record of the transaction history we are required to keep for tax and accounting purposes, and any information we are otherwise required to retain by law.",
          ),
          p(
            "If you signed in with Google, deleting your account with us does not delete your Google account. You may separately revoke our access from your Google Account permissions page (myaccount.google.com/permissions).",
          ),
        ],
      },
      {
        heading: "Do Not Track",
        blocks: [
          p(
            'While we take all reasonable steps to protect the privacy of our website visitors, we have not implemented the necessary program changes to honor "Do Not Track" or "DNT" browser signals at this time. As our online applications are refined, we will take reasonable steps to honor such requests in the future. Please return to this Policy for further updates on this topic.',
          ),
        ],
      },
    ],
  },
  {
    heading: "How Long Do We Retain Your Information?",
    blocks: [
      p(
        "We keep your information for the period necessary to fulfill the purposes described in this Policy, unless a longer retention period is permitted or required by law. As a general matter, we retain account information and the content you create for as long as your account remains active. If you delete your account, we delete that information as described above. Records we are required to keep for tax, accounting, or legal purposes are retained for the period required by applicable law. You may request deletion of your personal information at any time by emailing contact@yogawithlisa.ai, subject to certain exceptions such as legal obligations or active service agreements.",
      ),
    ],
  },
  {
    heading: "Location of the Site and International Visitors",
    blocks: [
      p(
        "The Site is hosted and operated in the United States. We and our service providers may store information about individuals in the United States, or we may transfer it to and store it within other countries. Visitors from jurisdictions outside the United States visit the Site at their own choice and risk. If you are not a resident of the United States, you acknowledge and agree that we may collect and use your personal information outside your home jurisdiction and that we may store your personal information in the United States or elsewhere. Please note that the level of legal protection provided in the United States may not be as stringent as that under the privacy laws of other countries, possibly including your home jurisdiction.",
      ),
    ],
  },
  {
    heading: "Links to Third-Party Websites",
    blocks: [
      p(
        "Our Site may contain links to third-party websites or platforms, including social media, scheduling tools, retreat information, and payment processors. These third parties have separate and independent privacy policies. We have no responsibility or liability for the content and activities of these linked sites. We urge you to read the privacy policies of other websites before submitting any information to those websites.",
      ),
    ],
  },
  {
    heading: "How Do We Protect Your Information?",
    blocks: [
      p(
        "We have implemented reasonable physical, technical, and administrative security standards to protect your information from unauthorized loss, misuse, alteration, or destruction. Traffic between your browser and our Services is encrypted in transit. Access to member-only content is authenticated on our servers, and our internal credentials are restricted to authorized individuals. However, no system or procedure is entirely secure or failsafe, and we do not guarantee the security of your information. If you believe your interaction with us is no longer secure, please contact us immediately at contact@yogawithlisa.ai.",
      ),
    ],
  },
  {
    heading: "GDPR Notice for Residents of the United Kingdom or European Economic Area",
    blocks: [
      p(
        "If you are resident in the UK or EEA, we will only process your personal data in compliance with applicable data protection laws, including the EU and UK General Data Protection Regulations. You have the right to request access to, correction of, erasure of, or restriction of processing of your personal data, as well as the right to data portability and to lodge a complaint with your local data protection supervisory authority. To exercise these rights, please contact us at contact@yogawithlisa.ai.",
      ),
    ],
  },
  {
    heading: "California Privacy Notice",
    blocks: [
      p("This notice applies to California residents and supplements our general Privacy Policy, as required by the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA)."),
      p("We will never sell, trade, or share your personal information with any unaffiliated organization or business for that organization's direct marketing purposes."),
    ],
    subsections: [
      {
        heading: "Your California Rights",
        blocks: [
          p(
            "You have the right to know what personal information we collect and how it is used; the right to request deletion of your personal information; the right to correct inaccurate information; the right to opt out of the sale or sharing of your personal information for cross-context behavioral advertising; the right to data portability; and the right to non-discrimination for exercising these rights.",
          ),
          p(
            "California law also permits residents to request certain details about information we disclose to third parties for direct marketing purposes. If you are a California resident and would like to request this information, please contact us at contact@yogawithlisa.ai. In your request, please attest to the fact that you are a California resident and provide a current California address for our response.",
          ),
          p(
            'To make a CCPA/CPRA request, email contact@yogawithlisa.ai with the subject line "CCPA Rights Request." We will respond within 45 days consistent with applicable law.',
          ),
        ],
      },
    ],
  },
  {
    heading: "Other States' Rights",
    blocks: [
      p(
        "If you are a resident of Colorado, Connecticut, Virginia, Texas, or other states with applicable privacy laws, you have similar rights to access, correct, delete, and opt out of the sale or sharing of your personal information. To make a request, contact contact@yogawithlisa.ai.",
      ),
    ],
  },
  {
    heading: "Do We Collect Information from Children?",
    blocks: [
      p(
        "The Site and Services are not intended for children under 18 years of age. No one under age 18 may provide any information to or on the Site or Services. We do not knowingly collect personal information from children under 18. If you are under 18, do not use or provide any information on the Site or Services or through any of their features, including your name or email address. Our student wellness programs for minors are administered through institutional partnerships such as schools and are subject to applicable educational privacy laws including FERPA and COPPA. If we learn we have collected or received personal information from a child under 18 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 18, please contact us at contact@yogawithlisa.ai.",
      ),
    ],
  },
  {
    heading: "Contact Us",
    blocks: [
      p("For any questions, or to request further information regarding this Policy, please contact us at:"),
      p("Yoga with Lisa by Lisa Eshun-Wilson & Associates, LLC"),
      p("Email: contact@yogawithlisa.ai"),
      p("Website: yogawithlisa.ai"),
    ],
  },
];
