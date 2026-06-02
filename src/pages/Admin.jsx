import AdminSection from "../components/AdminSection";

function Admin({
  tournaments,
  applications,
  contacts,
  teams,
  onAddTournament,
  onDeleteTournament,
  onUpdateApplicationStatus,
  onDeleteApplication,
  onDeleteContact,
  onResetDemoData,
}) {
  return (
    <AdminSection
      tournaments={tournaments}
      applications={applications}
      contacts={contacts}
      teams={teams}
      onAddTournament={onAddTournament}
      onDeleteTournament={onDeleteTournament}
      onUpdateApplicationStatus={onUpdateApplicationStatus}
      onDeleteApplication={onDeleteApplication}
      onDeleteContact={onDeleteContact}
      onResetDemoData={onResetDemoData}
    />
  );
}

export default Admin;
