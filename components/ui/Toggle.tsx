"use client";

import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={clsx(
        enabled ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-neutral-700",
        "relative inline-flex h-6 w-11 items-center rounded-full transition"
      )}
    >
      <span
        className={clsx(
          enabled
            ? "translate-x-6 bg-white dark:bg-black"
            : "translate-x-1 bg-white",
          "inline-block h-4 w-4 transform rounded-full transition"
        )}
      />
    </Switch>
  );
}
