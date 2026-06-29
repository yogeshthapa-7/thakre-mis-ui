import type { AnyType } from "./any-type";

export interface DashboardItem {
  Id: number;
  ElementKey: string;
  Title: string;
  ChartType: string;
  CssClass: string;
  DefaultProps: string;
  DashboardId: number;
}

export interface DashboardResponse {
  MetaData: AnyType;
  Data: AnyType[];
}
