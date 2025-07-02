import Link from "next/link";
import { igniteString, igniteImage, igniteArray } from "defaultprops";
import { ReactMarkdownElement } from "@/app/utils/parseMarkdown";

export const VideoWithStatsProps = {
  id: igniteString("video-with-stats"),

  title: igniteString("Why You Need a Building Survey"),
  description: igniteString(
    "Extensive research has shown that approximate **80% of home buyers neglect to obtain any type of property survey** prior to purchase, often resulting in unknown issues and defects arising shortly after their occupancy of the property.<br/><br/>**Which? and the Council of Mortgage Lenders both recommend** home buyers commission an independent building survey for these very reasons.<br/><br/>Which? found that for those people who did not get a survey, on average **one in four had to spend over £2,500** to put right serious defects which would have been identified in a home buyer building survey report. For **one in ten people it was over £10,000**. By contrast, those that did get a proper survey were able to **negotiate a reduction in the asking price** of the property that averaged **£2,000**.<br/><br/>In short, Independent, non-biased advice received from a qualified and accredited surveyor could potentially **save the home buyer thousands of pounds**, often helping to renegotiate the agreed purchase price in order to attend to any essential repairs found during a survey. In some cases, issues are brought to light that could make the prospective buyer reconsider the purchase of the property."
  ),

  videoUrl: igniteString("https://youtu.be/sknVtLSAea4"),

  stats: igniteArray([
    {
      metric: igniteString("80%"),
      label: igniteString("Of buyers skip surveys"),
    },
    {
      metric: igniteString("£2,500+"),
      label: igniteString("Average repair costs without survey"),
    },
    {
      metric: igniteString("£2,000"),
      label: igniteString("Average price reduction with survey"),
    },
    {
      metric: igniteString("£10,000+"),
      label: igniteString("Costs for 1 in 10 without survey"),
    },
  ]),
};
export default function VideoWithStats(props) {
  const mergedProps = { ...props };

  // Function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  return (
    <section className="py-24 relative" id={mergedProps.id.value}>
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-start lg:gap-12 gap-10 inline-flex">
          {/* Header Section */}
          <div className="w-full flex-col justify-start items-center gap-3 flex">
            <h2 className="text-center text-indigo-700 text-4xl font-bold font-manrope leading-normal">
              <ReactMarkdownElement>
                {mergedProps.title.value}
              </ReactMarkdownElement>
            </h2>
            <div className="max-w-3xl text-center text-gray-500 text-base font-normal leading-relaxed">
              <ReactMarkdownElement>
                {mergedProps.description.value}
              </ReactMarkdownElement>
            </div>
          </div>

          {/* Video Section */}
          <div className="w-full justify-center items-center gap-2.5 inline-flex relative">
            <div className="w-full aspect-video rounded-3xl overflow-hidden">
              <iframe
                src={getYouTubeEmbedUrl(mergedProps.videoUrl.value)}
                title="Company Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="w-full justify-between items-center lg:gap-10 gap-7 grid md:grid-cols-4 grid-cols-2">
            {mergedProps.stats.value.map((stat, index) => (
              <div
                key={index}
                className="w-full flex-col justify-start items-center inline-flex"
              >
                <h4 className="text-center text-indigo-700 text-4xl font-bold font-manrope leading-normal">
                  {stat.metric.value}
                </h4>
                <h6 className="text-center text-gray-500 text-base font-normal leading-relaxed">
                  {stat.label.value}
                </h6>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
