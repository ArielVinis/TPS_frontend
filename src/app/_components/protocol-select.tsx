"use client";

import { cn } from "@/lib/utils";

export type ProtocolOption = { id: string; name: string; description?: string | null };

interface ProtocolSelectProps {
  protocols: ProtocolOption[];
  value?: string;
  onChange?: (protocolId: string) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

export function ProtocolSelect({
  protocols,
  value,
  onChange,
  name,
  id,
  required,
  disabled,
  placeholder = "Selecione o protocolo",
  className,
  "aria-label": ariaLabel,
}: ProtocolSelectProps) {
  return (
    <select
      id={id}
      name={name}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      required={required}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
    >
      <option value="">{placeholder}</option>
      {protocols.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
