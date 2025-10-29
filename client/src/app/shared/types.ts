import { Model } from "../model/model";

export type ToolbarSource = 'AllyToolbar' | 'EnemyToolbar';

export interface ToolbarEvent {
  source: ToolbarSource;
  item: Model;
}