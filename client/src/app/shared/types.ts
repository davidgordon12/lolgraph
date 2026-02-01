import { Model } from "../model/model"

export type ToolbarSource = 'AllyToolbar' | 'EnemyToolbar'
export type SidebarSource = 'AllySidebar' | 'EnemySidebar'
export type ElementSource = 'Champions' | 'Items' | 'Selected'

export interface ToolbarEvent {
  source: ToolbarSource
  item: Model
}

export interface SidebarEvent {
  source: SidebarSource
  element: ElementSource
}