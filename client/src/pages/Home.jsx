import Hero from "../components/home/Hero";
import ServicesGrid from "../components/home/ServicesGrid";
import StatsBar from "../components/home/StatsBar";
import Testimonial from "../components/home/Testimonial";
import EnquiryForm from "../components/home/EnquiryForm";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <StatsBar />
      <Testimonial />
      <EnquiryForm />
    </>
  );
}
