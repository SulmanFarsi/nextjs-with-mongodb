import chalk from "chalk";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface LogProps {
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DANGER',
  message?: string;
  process: string;
}
export function log(props: LogProps) {
  const colors = {
    INFO: chalk.blue,
    SUCCESS: chalk.green,
    WARNING: chalk.yellow,
    ERROR: chalk.red.bold,
    DANGER: chalk.red,
  };
  console.log(colors[props.type](`\n ${props.type} :: [PROCESS:${props.process}] ${props.message} \n`));
}