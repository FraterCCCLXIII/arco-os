import { useState } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import type { CryptoAsset, CryptoChartPeriod, CryptoWalletData } from "./types";
import { CRYPTO_CHART_PERIODS } from "./types";
import styles from "./CryptoWalletView.tailwind";

export interface CryptoWalletViewProps {
  data: CryptoWalletData;
  selectedAssetId?: string | null;
  defaultSelectedAssetId?: string | null;
  onSelectedAssetChange?: (id: string | null) => void;
}

function AssetChart({ values, color }: { values: number[]; color: string }) {
  const width = 320;
  const height = 140;
  const padX = 4;
  const padY = 12;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = padX + (index / Math.max(values.length - 1, 1)) * (width - padX * 2);
      const y = padY + (1 - (value - min) / range) * (height - padY * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PortfolioScreen({
  data,
  onSelectAsset,
}: {
  data: CryptoWalletData;
  onSelectAsset: (id: string) => void;
}) {
  return (
    <>
      <header className={styles.portfolioHeader}>
        <button type="button" className={styles.addBtn} aria-label="Add asset">
          <Icon name="plus" size={18} />
        </button>
        <h1 className={styles.portfolioTitle}>Crypto</h1>
        <div className={styles.accountValueBlock}>
          <span className={styles.accountValueLabel}>Account Value</span>
          <span className={styles.accountValueAmount}>{data.totalBalance}</span>
        </div>
      </header>

      <div className={styles.actionRow}>
        <button type="button" className={styles.actionBtn}>
          <Icon name="arrow-up-right" size={16} />
          Send
        </button>
        <button type="button" className={styles.actionBtn}>
          <Icon name="download" size={16} />
          Receive
        </button>
      </div>

      <ul className={styles.assetList}>
        {data.assets.map((asset) => (
          <li key={asset.id}>
            <button type="button" className={styles.assetRow} onClick={() => onSelectAsset(asset.id)}>
              <span className={styles.assetIcon} style={{ background: asset.iconBg }}>
                {asset.icon}
              </span>
              <div className={styles.assetMeta}>
                <span className={styles.assetName}>{asset.name}</span>
                <span className={styles.assetPrice}>{asset.price}</span>
              </div>
              <div className={styles.assetHoldings}>
                <span className={styles.assetBalance}>{asset.balance}</span>
                <span className={styles.assetBalanceUsd}>{asset.balanceUsd}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <nav className={styles.bottomNav} aria-label="Crypto navigation">
        <button type="button" className={cx(styles.bottomNavBtn, styles.bottomNavBtnActive)} aria-label="Portfolio">
          <span className={styles.btcNavIcon}>₿</span>
        </button>
        <button type="button" className={styles.bottomNavBtn} aria-label="Swap">
          <Icon name="refresh" size={18} />
        </button>
        <button type="button" className={styles.bottomNavBtn} aria-label="Settings">
          <Icon name="settings" size={18} />
        </button>
      </nav>
    </>
  );
}

function AssetDetailScreen({
  asset,
  onBack,
}: {
  asset: CryptoAsset;
  onBack: () => void;
}) {
  const [period, setPeriod] = useState<CryptoChartPeriod>("1D");
  const chartValues = asset.chart ?? [42, 38, 45, 40, 48, 44, 50, 46, 52, 49, 55, 51];

  return (
    <>
      <header className={styles.detailHeader}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back">
          <Icon name="chevron-left" size={20} />
        </button>
        <h1 className={styles.detailTitle}>{asset.name}</h1>
        <span className={styles.detailIcon} style={{ background: asset.iconBg }}>
          {asset.icon}
        </span>
      </header>

      <div className={styles.priceBlock}>
        <span className={styles.priceAmount}>{asset.price}</span>
        {asset.changePercent && (
          <span className={styles.priceChange}>
            ↑ {asset.changePercent}
            {asset.changeUsd && ` +${asset.changeUsd} Today`}
          </span>
        )}
      </div>

      <div className={styles.detailChart}>
        <AssetChart values={chartValues} color={asset.iconBg} />
      </div>

      <div className={styles.periodRow}>
        {CRYPTO_CHART_PERIODS.map((item) => (
          <button
            key={item}
            type="button"
            className={cx(styles.periodPill, period === item && styles.periodPillActive)}
            onClick={() => setPeriod(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={styles.holdingCard}>
        <span className={styles.holdingLabel}>Account Value</span>
        <span className={styles.holdingAmount}>{asset.balance}</span>
        <span className={styles.holdingUsd}>{asset.balanceUsd}</span>
      </div>

      {asset.activities && asset.activities.length > 0 && (
        <section className={styles.activities}>
          <h2 className={styles.activitiesTitle}>Latest Activities</h2>
          <ul className={styles.activityList}>
            {asset.activities.map((activity) => (
              <li key={activity.id} className={styles.activityRow}>
                <div className={styles.activityMeta}>
                  <span className={styles.activityType}>
                    {activity.type === "sent" ? "Sent" : "Received"}
                  </span>
                  <span className={styles.activityDate}>{activity.date}</span>
                </div>
                <div className={styles.activityAmounts}>
                  <span className={styles.activityAmount}>{activity.amount}</span>
                  <span className={styles.activityUsd}>{activity.amountUsd}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className={styles.detailActions} aria-label="Asset actions">
        <button type="button" className={styles.detailActionBtn} aria-label="Send">
          <Icon name="arrow-up-right" size={18} />
        </button>
        <button type="button" className={styles.detailActionBtn} aria-label="Receive">
          <Icon name="download" size={18} />
        </button>
        <button type="button" className={styles.detailActionBtn} aria-label="Swap">
          <Icon name="refresh" size={18} />
        </button>
      </nav>
    </>
  );
}

/** Mobile crypto wallet — portfolio list and per-asset detail with chart. */
export function CryptoWalletView({
  data,
  selectedAssetId: controlledId,
  defaultSelectedAssetId = null,
  onSelectedAssetChange,
}: CryptoWalletViewProps) {
  const [internalId, setInternalId] = useState<string | null>(defaultSelectedAssetId);
  const selectedId = controlledId ?? internalId;
  const selectedAsset = data.assets.find((asset) => asset.id === selectedId) ?? null;

  function handleSelect(id: string) {
    if (onSelectedAssetChange) onSelectedAssetChange(id);
    else setInternalId(id);
  }

  function handleBack() {
    if (onSelectedAssetChange) onSelectedAssetChange(null);
    else setInternalId(null);
  }

  return (
    <div className={styles.phone}>
      <div className={styles.phoneScreen}>
        {selectedAsset ? (
          <AssetDetailScreen asset={selectedAsset} onBack={handleBack} />
        ) : (
          <PortfolioScreen data={data} onSelectAsset={handleSelect} />
        )}
      </div>
    </div>
  );
}
