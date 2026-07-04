import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { SidebarPane } from "../../shell/NavSidebar";
import { BankDashboardView } from "./BankDashboardView";
import { CryptoWalletView } from "./CryptoWalletView";
import { FinanceSidebar } from "./FinanceSidebar";
import type { BankCryptoView, BankDashboardData, CryptoWalletData } from "./types";
import styles from "./BankCryptoWorkspace.tailwind";

export interface BankCryptoWorkspaceProps {
  bank: BankDashboardData;
  crypto: CryptoWalletData;
  view?: BankCryptoView;
  defaultView?: BankCryptoView;
  onViewChange?: (view: BankCryptoView) => void;
}

/** Combined bank + crypto workspace — Mercury dashboard and mobile crypto wallet. */
export function BankCryptoWorkspace({
  bank,
  crypto,
  view: controlledView,
  defaultView = "bank",
  onViewChange,
}: BankCryptoWorkspaceProps) {
  const [internalView, setInternalView] = useState<BankCryptoView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: BankCryptoView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  return (
    <div className={styles.workspace}>
      <SidebarPane handleLabel="Resize finance sidebar" className={styles.sidebarResizable}>
        <FinanceSidebar data={bank} view={activeView} onViewChange={handleViewChange} />
      </SidebarPane>
      <ScrollArea className={styles.main}>
        {activeView === "bank" ? (
          <BankDashboardView data={bank} />
        ) : (
          <CryptoWalletView data={crypto} />
        )}
      </ScrollArea>
    </div>
  );
}

export type {
  BankCryptoView,
  BankDashboardData,
  BankAccount,
  BankNavItem,
  BankMoneyMovementItem,
  CryptoWalletData,
  CryptoAsset,
  CryptoActivity,
  CryptoChartPeriod,
} from "./types";

export { CRYPTO_CHART_PERIODS } from "./types";
