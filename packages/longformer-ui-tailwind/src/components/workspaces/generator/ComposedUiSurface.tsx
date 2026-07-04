import { useId } from "react";
import { Icon } from "../../../icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Switch,
  Textarea,
} from "../../primitives";
import type { ComposedUiSchema } from "./types";
import styles from "./GeneratorWorkspace.tailwind";

export function ComposedUiSurface({ schema }: { schema: ComposedUiSchema }) {
  switch (schema.kind) {
    case "contact-form":
      return <ContactFormSurface />;
    case "login-form":
      return <LoginFormSurface />;
    case "newsletter":
      return <NewsletterSurface />;
    case "profile-settings":
      return <ProfileSettingsSurface />;
    case "pricing-card":
      return <PricingCardSurface />;
    case "product-card":
      return <ProductCardSurface />;
    default:
      return null;
  }
}

function SurfaceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.previewCanvas}>
      <div className={styles.previewFrame}>{children}</div>
    </div>
  );
}

function ContactFormSurface() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  return (
    <SurfaceFrame>
      <Card padding="none" className={styles.composedCard}>
        <div className={styles.composedHeader}>
          <div className={styles.composedTitle}>Get in touch</div>
          <div className={styles.composedDescription}>We'll get back to you within one business day.</div>
        </div>
        <div className={styles.composedBody}>
          <div className={styles.formField}>
            <Label htmlFor={nameId}>Name</Label>
            <Input id={nameId} placeholder="Your name" />
          </div>
          <div className={styles.formField}>
            <Label htmlFor={emailId}>Email</Label>
            <Input id={emailId} placeholder="you@example.com" />
          </div>
          <div className={styles.formField}>
            <Label htmlFor={messageId}>Message</Label>
            <Textarea
              id={messageId}
              placeholder="How can we help?"
              rows={4}
              autoResize={false}
              className={styles.formTextarea}
            />
          </div>
        </div>
        <div className={styles.composedFooter}>
          <Button variant="primary" fullWidth>
            Send message
          </Button>
        </div>
      </Card>
    </SurfaceFrame>
  );
}

function LoginFormSurface() {
  const emailId = useId();
  const passwordId = useId();

  return (
    <SurfaceFrame>
      <Card padding="none" className={styles.composedCard}>
        <div className={styles.composedHeader}>
          <div className={styles.composedTitle}>Welcome back</div>
          <div className={styles.composedDescription}>Sign in to continue to your workspace.</div>
        </div>
        <div className={styles.composedBody}>
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
        <div className={styles.composedFooter}>
          <Button variant="primary" fullWidth>
            Sign in
          </Button>
        </div>
      </Card>
    </SurfaceFrame>
  );
}

function NewsletterSurface() {
  const emailId = useId();

  return (
    <SurfaceFrame>
      <Card padding="none" className={styles.composedCard}>
        <div className={styles.composedHeader}>
          <div className={styles.composedTitle}>Stay in the loop</div>
          <div className={styles.composedDescription}>Product updates and design system releases, monthly.</div>
        </div>
        <div className={styles.composedBody}>
          <div className={styles.formField}>
            <Label htmlFor={emailId}>Email</Label>
            <Input id={emailId} placeholder="you@example.com" />
          </div>
        </div>
        <div className={styles.composedFooter}>
          <Button variant="primary" fullWidth>
            Subscribe
          </Button>
        </div>
      </Card>
    </SurfaceFrame>
  );
}

function ProfileSettingsSurface() {
  const nameId = useId();
  const emailId = useId();

  return (
    <SurfaceFrame>
      <Card padding="none" className={styles.composedCard}>
        <div className={styles.composedHeader}>
          <div className={styles.composedTitle}>Profile settings</div>
          <div className={styles.composedDescription}>Update your public profile and contact details.</div>
        </div>
        <div className={styles.composedBody}>
          <div className={styles.profileRow}>
            <Avatar name="Alex Morgan" size="lg" />
            <Button variant="secondary" size="sm">
              Change photo
            </Button>
          </div>
          <div className={styles.formField}>
            <Label htmlFor={nameId}>Display name</Label>
            <Input id={nameId} defaultValue="Alex Morgan" />
          </div>
          <div className={styles.formField}>
            <Label htmlFor={emailId}>Email</Label>
            <Input id={emailId} defaultValue="alex@example.com" />
          </div>
          <Switch label="Show profile publicly" defaultChecked />
        </div>
        <div className={styles.composedFooter}>
          <Button variant="primary">Save changes</Button>
        </div>
      </Card>
    </SurfaceFrame>
  );
}

function PricingCardSurface() {
  const features = ["Unlimited projects", "Priority support", "Advanced analytics", "Custom domains"];

  return (
    <SurfaceFrame>
      <Card padding="none" className={styles.composedCard}>
        <div className={styles.composedHeader}>
          <div className={styles.composedEyebrow}>Pro plan</div>
          <div className={styles.composedTitle}>
            $29<span className={styles.composedPriceMeta}>/month</span>
          </div>
          <div className={styles.composedDescription}>Everything you need for production teams.</div>
        </div>
        <div className={styles.composedBody}>
          <ul className={styles.featureList}>
            {features.map((feature) => (
              <li key={feature} className={styles.featureItem}>
                <Icon name="check" size={14} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.composedFooter}>
          <Button variant="primary" fullWidth>
            Start free trial
          </Button>
        </div>
      </Card>
    </SurfaceFrame>
  );
}

function ProductCardSurface() {
  return (
    <SurfaceFrame>
      <Card padding="lg" className={styles.productCard}>
        <div className={styles.productArt} aria-hidden="true" />
        <div className={styles.productBody}>
          <div className={styles.composedTitle}>Wireless Headphones</div>
          <div className={styles.composedDescription}>Noise-cancelling · 30h battery</div>
          <div className={styles.productPriceRow}>
            <span className={styles.productPrice}>$249</span>
            <span className={styles.previewMuted}>Free shipping</span>
          </div>
          <Button variant="primary" fullWidth>
            Add to cart
          </Button>
        </div>
      </Card>
    </SurfaceFrame>
  );
}
