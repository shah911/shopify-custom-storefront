import Hero from "@/components/Hero";
import Section from "@/components/Section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="mb-6 lg:mb-0">
        <Section
          link="/yourwatch/diver-300m-co-axial-master-chronometer-42-mm"
          title="SEAMASTER DIVER 300M “PARIS 2024”"
          desc="The dreams of gold have started, as OMEGA launches a sporty timepiece
          dedicated to the Olympic Games Paris 2024."
          img="/52221422004001.jpg"
          buttonText="discover the watch"
          midSection={false}
        />
        <Section
          link="/Search?query=summer-blue"
          title="SEAMASTER COLLECTION IN SUMMER BLUE"
          desc="To celebrate its oceangoing icon, OMEGA has produced a collection of watches with dials in various layers of Summer Blue. A striking tone reminiscent of a perfect day on a boundless sea."
          img="/watches-pdp-square.jpg"
          buttonText="discover the watches"
          midSection={true}
        />
        <Section
          link="/Collection/seamaster"
          title="FIND YOUR SEAMASTER"
          desc="We have landed a selection of iconic models to help you find your perfect ocean watch."
          img="/seamaster_finder.jpg"
          buttonText="explore"
          midSection={false}
        />
      </div>
    </div>
  );
}
