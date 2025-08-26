const policyData = {
  title: "Privacy Policy",
  lastUpdated: "03.03.2025",
  introduction:
    "FineFix is committed to protecting your privacy and keeping your personal data secure in accordance with privacy protection laws.",
  sections: [
    {
      id: 1,
      title: "What information do we collect?",
      icon: "fas fa-info-circle",
      subsections: [
        {
          title: "Information you provide directly:",
          points: [
            "Full name",
            "Phone number",
            "Email address",
            "Parking ticket details (ticket number, vehicle number, municipality, etc.)",
            "Files you upload (such as a picture of the ticket)",
          ],
        },
        {
          title: "Technical information (collected automatically):",
          points: [
            "Device and browser type",
            "IP address",
            "Website usage data (to improve the service and prevent fraud)",
          ],
        },
      ],
    },
    {
      id: 2,
      title: "How do we use your information?",
      icon: "fas fa-cogs",
      points: [
        "To process and prepare a personalized appeal letter",
        "To send you updates regarding your appeal",
        "To improve the AI system and the service",
        "To comply with legal requirements",
      ],
    },
    {
      id: 3,
      title: "Data Storage and Security",
      icon: "fas fa-database",
      points: [
        "All data is stored securely in Supabase with full encryption",
        "We do not share personal data with third parties, except when required by law",
      ],
    },
    {
      id: 4,
      title: "User Rights",
      icon: "fas fa-user-shield",
      points: [
        "Access to your data",
        "Request to have your data deleted from the system",
        "Removal from mailing and advertising lists",
      ],
      contact: {
        text: "To request data deletion, you can contact us at",
        email: "finefix.help@gmail.com",
      },
    },
    {
      id: 5,
      title: "Use of Cookies",
      icon: "fas fa-cookie-bite",
      description:
        "FineFix uses cookies to improve the user experience. You can change your cookie settings through your web browser.",
    },
    {
      id: 6,
      title: "Updates to the Privacy Policy",
      icon: "fas fa-sync-alt",
      description:
        "The privacy policy may be updated from time to time. We will notify you of any significant changes via email or a notice on the website.",
    },
  ],
};

export default policyData;
