import React from "react";
import { z } from "zod";

export function usePersistedZodSchemaState<T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: () => T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, rawSetState] = React.useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? schema.parse(JSON.parse(item)) : initialValue();
  });
  React.useEffect(() => {
    let data = undefined;
    try {
      data = JSON.stringify(schema.parse(state));
    } catch (e) {
      console.error(e);
      return;
    }
    window.localStorage.setItem(key, data);
  }, [key, schema, state]);
  const setState = React.useCallback(
    (newState: React.SetStateAction<T>) => {
      rawSetState((oldState) => {
        if (typeof newState === "function") {
          return schema.parse((newState as (x: T) => T)(oldState));
        } else {
          return schema.parse(newState);
        }
      });
    },
    [schema],
  );
  return [state, setState];
}
