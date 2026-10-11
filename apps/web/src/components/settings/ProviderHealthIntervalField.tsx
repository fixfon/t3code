import { useState } from "react";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "../ui/number-field";
import {
  normalizeProviderHealthIntervalSeconds,
  PROVIDER_HEALTH_INTERVAL_STEP_SECONDS,
} from "./SettingsPanels.logic";

/**
 * Provider health interval in seconds. Edits stay in a local draft so holding
 * a stepper accumulates steps and a half-typed value is never saved; the
 * normalized value is persisted once, when the edit is committed (blur,
 * Enter, arrow keys, or releasing a stepper).
 */
export function ProviderHealthIntervalField({
  seconds,
  label,
  onCommit,
}: {
  seconds: number;
  /** Lowercase noun phrase used for the accessible names, e.g. "provider health interval". */
  label: string;
  onCommit: (seconds: number) => void;
}) {
  const [draft, setDraft] = useState<number | null>(seconds);
  const [savedSeconds, setSavedSeconds] = useState(seconds);
  if (savedSeconds !== seconds) {
    setSavedSeconds(seconds);
    setDraft(seconds);
  }

  return (
    <NumberField
      value={draft}
      min={0}
      step={PROVIDER_HEALTH_INTERVAL_STEP_SECONDS}
      size="sm"
      className="w-32"
      onValueChange={setDraft}
      onValueCommitted={(value) => {
        const normalized = normalizeProviderHealthIntervalSeconds(value);
        setDraft(normalized);
        onCommit(normalized);
      }}
    >
      <NumberFieldGroup>
        <NumberFieldDecrement aria-label={`Decrease ${label}`} />
        <NumberFieldInput
          aria-label={`${label.charAt(0).toUpperCase()}${label.slice(1)} in seconds`}
          // Base UI commits on blur and arrow keys but ignores Enter.
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
        <NumberFieldIncrement aria-label={`Increase ${label}`} />
      </NumberFieldGroup>
    </NumberField>
  );
}
