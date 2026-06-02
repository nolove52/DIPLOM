import TournamentsSection from "../components/TournamentsSection";

function Tournaments({ tournaments, onApplicationClick }) {
  return (
    <TournamentsSection
      tournaments={tournaments}
      onApplicationClick={onApplicationClick}
    />
  );
}

export default Tournaments;
