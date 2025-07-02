import FormWithImage, {
  FormWithImageProps,
} from "../../ComponentLibrary/ContactForm/FormWithImage";
import ContactSection, {
  ContactSectionProps,
} from "../../ComponentLibrary/ContactForm/ContactSection";

export const ContactFormMap = {
  ContactSection: {
    category: "Contact Form",
    component: ContactSection,
    name: "Contact Form Section",
    metadata: {
      props: ContactSectionProps,
    },
  },
  ContactFormWithIllustration: {
    category: "Contact Form",
    component: FormWithImage,
    name: "Contact Form with Image",
    metadata: {
      props: FormWithImageProps,
    },
  },
};
