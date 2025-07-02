import Link from "next/link";
import { igniteString, igniteArray } from "defaultprops";

export const ServicesGridProps = {
  id: igniteString("services-grid"),
  sectionTitle: igniteString("Comprehensive Security Solutions"),
  description: igniteString(
    "Setoria Security provides **elite security services** tailored for **nightlife venues, large-scale events, and private residences**. Our highly trained professionals ensure a **safe, secure, and controlled environment** for your business, guests, and home."
  ),

  services: igniteArray([
    {
      title: igniteString("Professional Door Security"),
      description: igniteString(
        "Ensure the **safety and smooth operation** of your venue with **licensed door supervisors and security personnel**. Our team specializes in **crowd control, access management, ID verification, and conflict resolution**, keeping your establishment secure."
      ),
      icon: igniteString("🚪"),
      items: igniteArray([
        igniteString("SIA-Licensed Door Supervisors"),
        igniteString("Crowd Control & Conflict De-escalation"),
        igniteString("ID & Age Verification"),
        igniteString("Emergency Response & First Aid"),
      ]),
    },
    {
      title: igniteString("Event Security & Crowd Control"),
      description: igniteString(
        "From **music festivals to corporate events**, our security team ensures **guest safety, crowd management, and emergency preparedness**. We deploy trained professionals to manage **entry screening, VIP security, and risk mitigation strategies**."
      ),
      icon: igniteString("🎤"),
      items: igniteArray([
        igniteString("Trained Event Security Personnel"),
        igniteString("VIP & Celebrity Close Protection"),
        igniteString("Bag Checks & Entry Screening"),
        igniteString("Emergency Planning & Rapid Response"),
      ]),
    },
    {
      title: igniteString("Residential Security & Private Protection"),
      description: igniteString(
        "Protect your home, estate, or gated community with **round-the-clock security patrols, access control, and advanced surveillance solutions**. Our residential security services provide **VIP protection, deterrence against intruders, and real-time monitoring**."
      ),
      icon: igniteString("🏡"),
      items: igniteArray([
        igniteString("24/7 Security Patrols"),
        igniteString("Gated Community & Private Estate Protection"),
        igniteString("CCTV & Advanced Surveillance Monitoring"),
        igniteString("Emergency Response & Threat Mitigation"),
      ]),
    },
  ]),
};

export default function ServicesGrid(props) {
  const mergedProps = { ...props };

  return (
    <div
      className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"
      id={mergedProps.id.value}
    >
      {/* Section Header */}
      <div className="max-w-xl mb-10 md:mx-auto text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-2 font-bold mb-4 text-xs tracking-wider uppercase rounded-full !text-black bg-[rgba(209,159,78,1)]">
            Our Services
          </p>
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight sm:text-4xl md:mx-auto">
            {mergedProps.sectionTitle.value}
          </h2>
        </div>

        <p className="text-base md:text-lg">{mergedProps.description.value}</p>
      </div>

      {/* Services Grid */}
      <div className="grid max-w-md gap-8 row-gap-10 sm:mx-auto lg:max-w-full lg:grid-cols-3">
        {mergedProps.services.value.map((service, index) => (
          <div key={index} className="flex flex-col sm:flex-row">
            {/* Icon */}
            <div className="sm:mr-4">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[rgba(209,159,78,0.2)]">
                <span className="text-2xl">{service.icon.value}</span>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h6 className="mb-2 font-semibold leading-5">
                {service.title.value}
              </h6>

              <p className="mb-3 text-sm">{service.description.value}</p>

              {/* Features List */}
              <ul className="mb-4 -ml-1 space-y-2">
                {service.items.value.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-1 text-[rgba(209,159,78,1)]">●</span>
                    {item.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
