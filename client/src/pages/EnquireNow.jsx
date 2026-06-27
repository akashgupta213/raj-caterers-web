import EnquiryForm from "../components/home/EnquiryForm";
import SectionHeading from "../components/common/SectionHeading";
export default function EnquireNow() {
  return (
    <>
      <div className="px-margin-mobile md:px-margin-desktop pt-section-gap">
        <SectionHeading eyebrow="Let's Talk" title="Enquire Now" />
      </div>
      <EnquiryForm />
    </>
  );
}
