import { useId, useState } from "react";
import { cx } from "../../../../utils/cx";
import { Icon } from "../../../../icons";
import { NavRailBrandMark } from "../../../shell/NavRail/NavRailBrandMark";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Input,
  Label,
} from "../../../primitives";
import type { SpecialPageId } from "./types";
import { DEFAULT_DESKTOP_WALLPAPER_URL } from "../wallpaper";
import styles from "./SpecialPages.tailwind";

interface PlanOption {
  id: string;
  label: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const PLANS: PlanOption[] = [
  {
    id: "free",
    label: "Free",
    price: 0,
    description: "For personal exploration",
    features: ["3 projects", "Community support", "Basic analytics"],
  },
  {
    id: "pro",
    label: "Pro",
    price: 29,
    description: "For daily power users",
    features: ["Unlimited projects", "Priority support", "Advanced analytics", "Custom themes"],
    popular: true,
  },
  {
    id: "team",
    label: "Team",
    price: 79,
    description: "For growing teams",
    features: ["Everything in Pro", "Shared workspaces", "Admin controls", "SSO"],
  },
];

const SETUP_STEPS = [
  {
    label: "Account",
    title: "Create your account",
    description: "Start with the basics so we can save your workspace.",
  },
  {
    label: "Plan",
    title: "Choose your plan",
    description: "Pick the tier that fits how you work. You can change this anytime.",
  },
  {
    label: "Personalize",
    title: "Make it yours",
    description: "Add a few finishing touches before you jump in.",
  },
] as const;

function SpecialPageLogo() {
  return <NavRailBrandMark className={styles.logoMark} aria-hidden="true" />;
}

interface PlanPickerProps {
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
  compact?: boolean;
}

function PlanPicker({ selectedPlan, onSelectPlan, compact = false }: PlanPickerProps) {
  return (
    <div className={cx(styles.planList, compact && styles.planListCompact)} role="radiogroup">
      {PLANS.map((plan) => {
        const selected = selectedPlan === plan.id;

        return (
          <button
            key={plan.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cx(styles.planCard, selected && styles.planCardSelected, compact && styles.planCardCompact)}
            onClick={() => onSelectPlan(plan.id)}
          >
            <span className={cx(styles.planRadio, selected && styles.planRadioSelected)} aria-hidden="true">
              {selected && <Icon name="check" size={10} />}
            </span>
            <span className={styles.planContent}>
              <span className={styles.planHeader}>
                <span className={styles.planName}>{plan.label}</span>
                {plan.popular && (
                  <Badge tone="accent" className={styles.planBadge}>
                    Popular
                  </Badge>
                )}
              </span>
              {!compact && <span className={styles.planDescription}>{plan.description}</span>}
            </span>
            <span className={styles.planPrice}>
              <span className={styles.planPriceAmount}>{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
              {plan.price > 0 && <span className={styles.planPricePeriod}>/mo</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PlanFeaturePanel({ planId }: { planId: string }) {
  const plan = PLANS.find((entry) => entry.id === planId) ?? PLANS[1];

  return (
    <div className={styles.planFeaturePanel}>
      <p className={styles.planFeatureTitle}>Included with {plan.label}</p>
      <ul className={styles.featureList}>
        {plan.features.map((feature) => (
          <li key={feature} className={styles.featureItem}>
            <Icon name="check" size={14} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface WizardProgressProps {
  step: number;
  totalSteps: number;
}

function WizardProgress({ step, totalSteps }: WizardProgressProps) {
  return (
    <div className={styles.wizardProgress}>
      <div className={styles.stepSegments} aria-hidden="true">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          return (
            <span
              key={stepNumber}
              className={cx(
                styles.stepSegment,
                stepNumber <= step && styles.stepSegmentFilled,
                stepNumber === step && styles.stepSegmentActive,
              )}
            />
          );
        })}
      </div>
      <div className={styles.stepLabels}>
        {SETUP_STEPS.map((entry, index) => {
          const stepNumber = index + 1;
          return (
            <span
              key={entry.label}
              className={cx(styles.stepLabel, stepNumber <= step && styles.stepLabelActive)}
            >
              {entry.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export interface SpecialPageViewProps {
  page: SpecialPageId;
}

export function SpecialPageView({ page }: SpecialPageViewProps) {
  switch (page) {
    case "booting":
      return <BootingPage />;
    case "loading":
      return <LoadingPage />;
    case "sign-in":
      return <SignInPage />;
    case "upgrade":
      return <UpgradePage />;
    case "setup-wizard":
      return <SetupWizardPage />;
    case "error":
      return <ErrorPage />;
    default:
      return null;
  }
}

function BootingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.centered}>
        <SpecialPageLogo />
        <h1 className={styles.title}>Longformer</h1>
        <p className={styles.subtitle}>Starting your workspace…</p>
        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
}

function LoadingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.centered}>
        <SpecialPageLogo />
        <Icon name="loader" size={32} className={styles.loader} aria-hidden="true" />
        <h1 className={styles.title}>Loading</h1>
        <p className={styles.subtitle}>Fetching your latest data</p>
      </div>
    </div>
  );
}

function SignInPage() {
  const emailId = useId();
  const passwordId = useId();

  return (
    <div className={cx(styles.page, styles.signInPage)}>
      <div
        className={styles.signInBackdrop}
        style={{ backgroundImage: `url("${DEFAULT_DESKTOP_WALLPAPER_URL}")` }}
        aria-hidden="true"
      />
      <Card padding="none" className={styles.card}>
        <div className={styles.cardHeader}>
          <SpecialPageLogo />
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to continue to your workspace.</p>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.formField}>
            <Label htmlFor={emailId}>Email</Label>
            <Input id={emailId} placeholder="you@example.com" />
          </div>
          <div className={styles.formField}>
            <Label htmlFor={passwordId}>Password</Label>
            <Input id={passwordId} type="password" placeholder="••••••••" />
          </div>
          <Checkbox label="Remember me" defaultChecked />
        </div>
        <div className={styles.cardFooter}>
          <Button variant="primary" fullWidth>
            Sign in
          </Button>
        </div>
      </Card>
    </div>
  );
}

function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const activePlan = PLANS.find((plan) => plan.id === selectedPlan) ?? PLANS[1];

  return (
    <div className={styles.page}>
      <Card padding="none" className={cx(styles.card, styles.wideCard)}>
        <div className={styles.cardHeader}>
          <SpecialPageLogo />
          <h1 className={styles.title}>Upgrade your workspace</h1>
          <p className={styles.subtitle}>Choose a plan that matches how you work. Switch or cancel anytime.</p>
        </div>
        <div className={styles.cardBody}>
          <PlanPicker selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
          <PlanFeaturePanel planId={selectedPlan} />
        </div>
        <div className={styles.cardFooter}>
          <Button variant="primary" fullWidth>
            Continue with {activePlan.label}
          </Button>
          <p className={styles.footerNote}>Billed monthly. No charge until you confirm.</p>
        </div>
      </Card>
    </div>
  );
}

function SetupWizardPage() {
  const emailId = useId();
  const passwordId = useId();
  const nameId = useId();
  const workspaceId = useId();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const totalSteps = SETUP_STEPS.length;
  const currentStep = SETUP_STEPS[step - 1];

  return (
    <div className={styles.page}>
      <div className={styles.wizardStack}>
        <SpecialPageLogo />
        <Card padding="none" className={cx(styles.card, styles.wizardCard)}>
          <div className={styles.cardHeader}>
            <WizardProgress step={step} totalSteps={totalSteps} />
            <div className={styles.wizardHeading}>
              <span className={styles.wizardEyebrow}>
                Step {step} of {totalSteps}
              </span>
              <h1 className={styles.title}>{currentStep.title}</h1>
              <p className={styles.subtitle}>{currentStep.description}</p>
            </div>
          </div>
        <div className={styles.cardBody}>
          <div className={styles.wizardPanel}>
            {step === 1 && (
              <>
                <div className={styles.formField}>
                  <Label htmlFor={emailId}>Email</Label>
                  <Input id={emailId} type="email" placeholder="you@example.com" />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor={passwordId}>Password</Label>
                  <Input id={passwordId} type="password" placeholder="Create a password" />
                </div>
                <Checkbox label="Send me product updates and tips" />
              </>
            )}
            {step === 2 && <PlanPicker selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} compact />}
            {step === 3 && (
              <>
                <div className={styles.formField}>
                  <Label htmlFor={nameId}>Display name</Label>
                  <Input id={nameId} placeholder="Alex Morgan" />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor={workspaceId}>Workspace name</Label>
                  <Input id={workspaceId} placeholder="Alex's workspace" />
                </div>
                <div className={styles.themePicker}>
                  <span className={styles.themePickerLabel}>Accent color</span>
                  <div className={styles.themeSwatches} role="radiogroup" aria-label="Accent color">
                    {["#3957b7", "#04c418", "#f2b017", "#fc5643"].map((color, index) => (
                      <button
                        key={color}
                        type="button"
                        role="radio"
                        aria-checked={index === 0}
                        className={cx(styles.themeSwatch, index === 0 && styles.themeSwatchSelected)}
                        style={{ background: color }}
                        aria-label={`Accent color ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.wizardActions}>
            <Button
              variant="ghost"
              disabled={step === 1}
              onClick={() => setStep((value) => Math.max(1, value - 1))}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep((value) => (value < totalSteps ? value + 1 : value))}
            >
              {step === totalSteps ? "Finish setup" : "Continue"}
            </Button>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}

function ErrorPage() {
  return (
    <div className={styles.page}>
      <div className={styles.centered}>
        <EmptyState
          icon={
            <div className={styles.errorIcon}>
              <Icon name="close" size={24} />
            </div>
          }
          title="Something went wrong"
          description="We couldn't load this page. Check your connection and try again."
          actions={
            <>
              <Button variant="primary">Try again</Button>
              <Button variant="ghost">Go home</Button>
            </>
          }
        />
      </div>
    </div>
  );
}
