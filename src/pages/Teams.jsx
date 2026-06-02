import TeamsSection from "../components/TeamsSection";

function Teams({
  user,
  teams,
  onLoginClick,
  onCreateTeam,
  onInviteToTeam,
  onAcceptInvite,
  onDeclineInvite,
  onDeleteTeam,
}) {
  return (
    <TeamsSection
      user={user}
      teams={teams}
      onLoginClick={onLoginClick}
      onCreateTeam={onCreateTeam}
      onInviteToTeam={onInviteToTeam}
      onAcceptInvite={onAcceptInvite}
      onDeclineInvite={onDeclineInvite}
      onDeleteTeam={onDeleteTeam}
    />
  );
}

export default Teams;
