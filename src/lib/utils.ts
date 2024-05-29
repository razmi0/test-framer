import { clsx, type ClassValue } from "clsx";
import {
  isValidElement,
  type ComponentType,
  type FunctionComponent,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const format = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const getComponentDisplayName = (element: ReactElement<any>) => {
  const node = element as ReactElement<ComponentType<any>>;
  const type = (node as unknown as ReactElement<FunctionComponent>).type;
  const displayName =
    typeof type === "function"
      ? (type as FunctionComponent).displayName || (type as FunctionComponent).name || "Unknown"
      : type;
  return displayName;
};

export const validAndHasProps = (child: unknown): child is ReactElement<any> => {
  return isValidElement(child) && (child.props as PropsWithChildren<any>);
};
