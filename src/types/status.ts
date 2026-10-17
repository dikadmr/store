export type StatusVariant = "default" | "secondary" | "destructive" | "outline";

export interface StatusConfig {
  label: string;
  variant: StatusVariant;
}
