export const debug = (
  name: string,
  { collapsed = true }: { collapsed?: boolean } = {},
) => {
  collapsed ? console.groupCollapsed(name) : console.group(name);
  const log = (...args) => console.debug(...args);
  log.end = () => console.groupEnd();
  return log;
};
