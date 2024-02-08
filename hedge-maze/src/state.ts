import debugFactory from "debug";

const debug = debugFactory("state");

export interface State {
  level: number;
}

const initial: State = {
  level: 0,
};

const STORAGE_KEY = "maze_state";

const retrieve = (): State => {
  const rawState = localStorage.getItem(STORAGE_KEY);
  if (!rawState) {
    debug("No state found in localstorage, use initial");
    store(initial);
    return initial;
  }

  try {
    return JSON.parse(rawState) as State;
  } catch (e) {
    debug("Failed to parse state", e.message);
    return initial;
  }
};

const store = (state: State) => {
  const rawState = JSON.stringify(state);
  try {
    localStorage.setItem(STORAGE_KEY, rawState);
  } catch (e) {
    debug("Failed to store state", e);
  }
};

const set = (key: keyof State, value: any) => {
  const state = retrieve();
  state[key] = value;
  store(state);
};

export const get = (key: keyof State): any => {
  const state = retrieve();
  return state[key];
};

export const incrementLevel = () => {
  const level = get("level");
  set("level", level + 1);
};

export const resetLevel = () => {
  set("level", 0);
};
