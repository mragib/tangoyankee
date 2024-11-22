import SpinnerMini from "@/ui/SpinningMini";
import Stat from "./Stat";

function GeneralLedgerStats({ isLoading, assets }) {
  if (isLoading) return <SpinnerMini />;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5">
      {assets.map((gl, index) => (
        <Stat key={index} gl={gl} />
      ))}
    </div>
  );
}

export default GeneralLedgerStats;
