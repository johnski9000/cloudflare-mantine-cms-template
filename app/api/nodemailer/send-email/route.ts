import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    // Helper function to format field names
    const formatFieldName = (key) => {
      return key
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
    };

    // Helper function to get emoji for field
    const getFieldEmoji = (key) => {
      const emojiMap = {
        name: "👤",
        email: "📧",
        phone: "📞",
        message: "💬",
        company: "🏢",
        subject: "📋",
        website: "🌐",
        address: "📍",
        city: "🏙️",
        state: "🗺️",
        country: "🌍",
        zipcode: "📮",
        zip: "📮",
        budget: "💰",
        timeline: "⏰",
        service: "🔧",
        priority: "⚡",
        category: "📂",
        department: "🏛️",
        title: "💼",
        position: "💼",
      };

      return emojiMap[key.toLowerCase()] || "📝";
    };

    // Helper function to format field values
    const formatFieldValue = (key, value) => {
      if (!value || value === "") return "N/A";

      // Handle email fields - make them clickable
      if (key.toLowerCase().includes("email")) {
        return `<a href="mailto:${value}" style="color: #007BFF; text-decoration: none;">${value}</a>`;
      }

      // Handle phone fields - make them clickable
      if (key.toLowerCase().includes("phone")) {
        return `<a href="tel:${value}" style="color: #007BFF; text-decoration: none;">${value}</a>`;
      }

      // Handle URLs - make them clickable
      if (
        key.toLowerCase().includes("website") ||
        key.toLowerCase().includes("url")
      ) {
        const url = value.startsWith("http") ? value : `https://${value}`;
        return `<a href="${url}" target="_blank" style="color: #007BFF; text-decoration: none;">${value}</a>`;
      }

      // Handle long text fields (like messages) - preserve line breaks
      if (typeof value === "string" && value.length > 100) {
        return value.replace(/\n/g, "<br>");
      }

      return value;
    };

    // Generate table rows for all fields
    const generateTableRows = (data) => {
      return Object.entries(data)
        .filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== ""
        )
        .map(([key, value]) => {
          const emoji = getFieldEmoji(key);
          const fieldName = formatFieldName(key);
          const fieldValue = formatFieldValue(key, value);

          return `
            <tr>
              <td style="background-color: #f1f1f1; padding: 10px; font-weight: bold; vertical-align: top;">${emoji} ${fieldName}:</td>
              <td style="padding: 10px; vertical-align: top;">${fieldValue}</td>
            </tr>
          `;
        })
        .join("");
    };

    // Determine subject line (use subject field if available, otherwise use name)
    const getSubjectLine = (data) => {
      if (data.subject) {
        return `Contact Form: ${data.subject}`;
      } else if (data.name) {
        return `New Contact Request from ${data.name}`;
      } else {
        return "New Contact Form Submission";
      }
    };

    // Determine reply-to email
    const getReplyToEmail = (data) => {
      return data.email || data.contactEmail || data.emailAddress || undefined;
    };

    // Build the email
    const tableRows = generateTableRows(body);
    const subjectLine = getSubjectLine(body);
    const replyToEmail = getReplyToEmail(body);

    const mailData = {
      from: process.env.NODEMAILER_USER,
      to: "enquiries@anslow-building-surveyors.co.uk",
      ...(replyToEmail && { replyTo: replyToEmail }),
      subject: subjectLine,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">📩 New Contact Form Submission</h2>
          <p style="font-size: 16px; color: #555;">You have received a new message from your website's contact form:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${tableRows}
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-left: 4px solid #007BFF; border-radius: 4px;">
            <p style="font-size: 14px; color: #555; margin: 0;">
              <strong>📅 Submitted:</strong> ${new Date().toLocaleString()}<br>
              <strong>🌐 Source:</strong> Website Contact Form
            </p>
          </div>
          
          ${
            replyToEmail
              ? `
            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${replyToEmail}" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                📧 Reply to Customer
              </a>
            </div>
          `
              : ""
          }
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailData);

    // Respond with success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while sending the message",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
