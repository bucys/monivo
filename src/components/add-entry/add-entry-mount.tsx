import { AddEntrySheet } from "./add-entry-sheet";
import type { ServiceChip } from "./income-form";

// Mounted once in the AppShell. Services + canWrite are passed down from the
// app layout, which already reads them — this avoids a duplicate getUser +
// profile + services round-trip on every navigation.
export function AddEntryMount({
  services,
  canWrite,
}: {
  services: ReadonlyArray<ServiceChip>;
  canWrite: boolean;
}) {
  return <AddEntrySheet services={services} canWrite={canWrite} />;
}
