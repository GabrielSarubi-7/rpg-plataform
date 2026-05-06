export function isEventFromUiLayer(event: React.SyntheticEvent) {
  const target = event.target as HTMLElement | null;

  return Boolean(target?.closest("[data-ui-layer='true']"));
}