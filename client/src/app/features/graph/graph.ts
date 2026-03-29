import { AfterViewInit, Component, Input, OnDestroy, WritableSignal, effect, inject, signal } from '@angular/core';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Champion } from '../../model/champion.model';
import { Item, mapItem } from '../../model/item.model';
import { DPSGraphPoint, DPSService } from '../../core/dps.service';

@Component({
    selector: 'app-graph',
    imports: [Toolbar, Sidebar],
    templateUrl: './graph.html',
    styleUrl: './graph.css'
})

export class Graph implements AfterViewInit, OnDestroy {
    @Input() championList!: Champion[]
    @Input() itemList!: Item[]

    private dpsservice = inject(DPSService)

    allyChampion: WritableSignal<Champion> = signal(undefined as any)
    allyItems: WritableSignal<Map<string, Item>> = signal(new Map())
    allyLevel: number = 1
    enemyLevel: number = 1

    enemyChampion: WritableSignal<Champion> = signal(undefined as any)
    enemyItems: WritableSignal<Map<string, Item>> = signal(new Map())
    private resizeObserver?: ResizeObserver
    private hasCalculatedGraph = false
    private lastEmptyMessage = 'Click the graph to calculate DPS'
    private lastGraphPoints: DPSGraphPoint[] = []
    private hoveredPoint: DPSGraphPoint | null = null
    private graphCanvas?: HTMLCanvasElement
    private readonly handleCanvasMouseMove = (event: MouseEvent) => this.updateHoveredPoint(event)
    private readonly handleCanvasMouseLeave = () => this.clearHoveredPoint()
    private isViewReady = false
    private renderQueued = false

    private readonly graphPadding = { top: 40, right: 40, bottom: 70, left: 80 }
    private readonly tickCount = 5

    constructor() {
        effect(() => {
            this.allyChampion()
            this.enemyChampion()
            this.allyItems()
            this.enemyItems()

            if (this.isViewReady) {
                this.queueGraphRender()
            }
        })
    }

    private calculateRiotGrowthStat(base: number, growth: number, level: number): number {
        if (level <= 1) return base

        const levelOffset = level - 1
        const growthMultiplier = 0.7025 + (0.0175 * levelOffset)
        return base + (growth * levelOffset * growthMultiplier)
    }

    private prepareCanvas(): { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number } | null {
        const canvas = document.getElementById('graph') as HTMLCanvasElement | null
        if (!canvas) return null

        const context = canvas.getContext('2d')
        if (!context) return null

        const { width, height } = canvas.getBoundingClientRect()
        const devicePixelRatio = window.devicePixelRatio || 1
        const displayWidth = Math.max(1, Math.round(width))
        const displayHeight = Math.max(1, Math.round(height))
        const pixelWidth = Math.max(1, Math.round(displayWidth * devicePixelRatio))
        const pixelHeight = Math.max(1, Math.round(displayHeight * devicePixelRatio))

        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
            canvas.width = pixelWidth
            canvas.height = pixelHeight
        }

        context.setTransform(1, 0, 0, 1, 0, 0)
        context.scale(devicePixelRatio, devicePixelRatio)

        return { canvas, context, width: displayWidth, height: displayHeight }
    }

    private drawEmptyGraph(message: string): void {
        const preparedCanvas = this.prepareCanvas()
        if (!preparedCanvas) return

        this.hasCalculatedGraph = false
        this.lastEmptyMessage = message
        this.lastGraphPoints = []
        this.hoveredPoint = null

        const { context, width, height } = preparedCanvas

        context.clearRect(0, 0, width, height)
        context.fillStyle = '#111827'
        context.fillRect(0, 0, width, height)

        context.fillStyle = '#f9fafb'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.font = '24px sans-serif'
        context.fillText(message, width / 2, height / 2)
    }

    private drawGraph(points: DPSGraphPoint[]): void {
        const preparedCanvas = this.prepareCanvas()
        if (!preparedCanvas || points.length === 0) return

        this.hasCalculatedGraph = true
        this.lastGraphPoints = points

        const { context, width, height } = preparedCanvas
        const padding = this.graphPadding
        const graphWidth = width - padding.left - padding.right
        const graphHeight = height - padding.top - padding.bottom
        const maxDamage = Math.max(...points.map(point => point.damage), 1)
        const maxArmor = Math.max(...points.map(point => point.armor), 1)
        const tickCount = this.tickCount
        const actualArmor = this.calculateRiotGrowthStat(
            this.enemyChampion().stats.armor,
            this.enemyChampion().stats.armorperlevel,
            this.enemyLevel
        )
            + [...this.enemyItems().values()].reduce((total, item) => total + (mapItem(item).stats.flatarmormod ?? 0), 0)

        context.clearRect(0, 0, width, height)
        context.fillStyle = '#111827'
        context.fillRect(0, 0, width, height)

        context.strokeStyle = '#4b5563'
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(padding.left, padding.top)
        context.lineTo(padding.left, height - padding.bottom)
        context.lineTo(width - padding.right, height - padding.bottom)
        context.stroke()

        context.strokeStyle = '#374151'
        context.fillStyle = '#9ca3af'
        context.font = '12px sans-serif'

        for (let i = 0; i <= tickCount; i++) {
            const x = padding.left + (graphWidth * i) / tickCount
            const armorValue = (maxArmor * i) / tickCount

            context.beginPath()
            context.moveTo(x, height - padding.bottom)
            context.lineTo(x, height - padding.bottom + 6)
            context.stroke()

            context.textAlign = 'center'
            context.textBaseline = 'top'
            context.fillText(armorValue.toFixed(0), x, height - padding.bottom + 10)
        }

        for (let i = 0; i <= tickCount; i++) {
            const y = height - padding.bottom - (graphHeight * i) / tickCount
            const damageValue = (maxDamage * i) / tickCount

            context.beginPath()
            context.moveTo(padding.left - 6, y)
            context.lineTo(padding.left, y)
            context.stroke()

            context.textAlign = 'right'
            context.textBaseline = 'middle'
            context.fillText(damageValue.toFixed(0), padding.left - 10, y)
        }

        context.fillStyle = '#e5e7eb'
        context.font = '16px sans-serif'
        context.textAlign = 'center'
        context.textBaseline = 'alphabetic'
        context.fillText('Enemy Total Armor', padding.left + graphWidth / 2, height - 24)

        context.save()
        context.translate(28, padding.top + graphHeight / 2)
        context.rotate(-Math.PI / 2)
        context.fillText('Damage', 0, 0)
        context.restore()

        context.font = '14px sans-serif'
        context.strokeStyle = '#22c55e'
        context.lineWidth = 3
        context.beginPath()

        points.forEach((point, index) => {
            const x = padding.left + (point.armor / maxArmor) * graphWidth
            const y = height - padding.bottom - (point.damage / maxDamage) * graphHeight

            if (index === 0) context.moveTo(x, y)
            else context.lineTo(x, y)
        })

        context.stroke()

        const actualPoint = points.reduce((closest, point) =>
            Math.abs(point.armor - actualArmor) < Math.abs(closest.armor - actualArmor) ? point : closest
        )

        const actualX = padding.left + (actualPoint.armor / maxArmor) * graphWidth
        const actualY = height - padding.bottom - (actualPoint.damage / maxDamage) * graphHeight

        context.fillStyle = '#f59e0b'
        context.beginPath()
        context.arc(actualX, actualY, 6, 0, Math.PI * 2)
        context.fill()

        context.fillStyle = '#f9fafb'
        context.textAlign = 'left'
        context.fillText(
            `${actualPoint.damage.toFixed(2)} dmg @ ${actualPoint.armor.toFixed(0)} armor`,
            Math.min(actualX + 12, width - 220),
            Math.max(actualY - 12, padding.top + 16)
        )

        if (this.hoveredPoint) {
            const hoverX = padding.left + (this.hoveredPoint.armor / maxArmor) * graphWidth
            const hoverY = height - padding.bottom - (this.hoveredPoint.damage / maxDamage) * graphHeight
            const tooltipText = `${this.hoveredPoint.damage.toFixed(2)} DPS @ ${this.hoveredPoint.armor.toFixed(0)} armor`

            context.strokeStyle = '#93c5fd'
            context.lineWidth = 1
            context.beginPath()
            context.moveTo(hoverX, padding.top)
            context.lineTo(hoverX, height - padding.bottom)
            context.moveTo(padding.left, hoverY)
            context.lineTo(width - padding.right, hoverY)
            context.stroke()

            context.fillStyle = '#93c5fd'
            context.beginPath()
            context.arc(hoverX, hoverY, 5, 0, Math.PI * 2)
            context.fill()

            context.font = '13px sans-serif'
            const tooltipWidth = context.measureText(tooltipText).width + 20
            const tooltipX = Math.min(Math.max(padding.left, hoverX + 12), width - padding.right - tooltipWidth)
            const tooltipY = hoverY < padding.top + 36 ? hoverY + 16 : hoverY - 32

            context.fillStyle = 'rgba(17, 24, 39, 0.95)'
            context.fillRect(tooltipX, tooltipY, tooltipWidth, 24)
            context.strokeStyle = '#93c5fd'
            context.strokeRect(tooltipX, tooltipY, tooltipWidth, 24)

            context.fillStyle = '#f9fafb'
            context.textAlign = 'left'
            context.textBaseline = 'middle'
            context.fillText(tooltipText, tooltipX + 10, tooltipY + 12)
        }
    }

    private updateHoveredPoint(event: MouseEvent): void {
        if (!this.hasCalculatedGraph || this.lastGraphPoints.length === 0) return

        const canvas = document.getElementById('graph') as HTMLCanvasElement | null
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const padding = this.graphPadding
        const graphWidth = rect.width - padding.left - padding.right
        const graphHeight = rect.height - padding.top - padding.bottom

        if (
            x < padding.left || x > padding.left + graphWidth ||
            y < padding.top || y > padding.top + graphHeight
        ) {
            if (this.hoveredPoint) {
                this.hoveredPoint = null
                this.drawGraph(this.lastGraphPoints)
            }
            return
        }

        const maxArmor = Math.max(...this.lastGraphPoints.map(point => point.armor), 1)
        const hoveredArmor = ((x - padding.left) / graphWidth) * maxArmor
        const nearestPoint = this.lastGraphPoints.reduce((closest, point) =>
            Math.abs(point.armor - hoveredArmor) < Math.abs(closest.armor - hoveredArmor) ? point : closest
        )

        if (
            !this.hoveredPoint ||
            this.hoveredPoint.armor !== nearestPoint.armor ||
            this.hoveredPoint.damage !== nearestPoint.damage
        ) {
            this.hoveredPoint = nearestPoint
            this.drawGraph(this.lastGraphPoints)
        }
    }

    private clearHoveredPoint(): void {
        if (!this.hoveredPoint || this.lastGraphPoints.length === 0) return

        this.hoveredPoint = null
        this.drawGraph(this.lastGraphPoints)
    }

    private async renderCurrentGraph(): Promise<void> {
        if (!this.allyChampion() || !this.enemyChampion()) {
            this.drawEmptyGraph('Select both champions to plot the graph')
            return
        }

        const points = await this.dpsservice.calculateAutoAttackDPSGraph(
            this.allyLevel, this.enemyLevel,
            this.allyChampion(), this.enemyChampion(),
            [...this.allyItems().values()], [...this.enemyItems().values()]
        )

        this.drawGraph(points)
    }

    private queueGraphRender(): void {
        if (!this.isViewReady || this.renderQueued) return

        this.renderQueued = true
        queueMicrotask(async () => {
            this.renderQueued = false
            await this.renderCurrentGraph()
        })
    }

    private redrawCurrentGraph(): void {
        if (this.hasCalculatedGraph) {
            if (this.lastGraphPoints.length > 0) {
                this.drawGraph(this.lastGraphPoints)
                return
            }

            void this.renderCurrentGraph()
            return
        }

        this.drawEmptyGraph(this.lastEmptyMessage)
    }

    focusGraph(): void {
        document.getElementById('ally-champion-toolbar')!.style.display = 'none'
        document.getElementById('enemy-champion-toolbar')!.style.display = 'none'
        document.getElementById('ally-item-toolbar')!.style.display = 'none'
        document.getElementById('enemy-item-toolbar')!.style.display = 'none'
    }

    updateLevel(src: string, level: number): void {
        if(src == "ally")
            this.allyLevel = level
        else
            this.enemyLevel = level

        this.queueGraphRender()
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect()
        this.graphCanvas?.removeEventListener('mousemove', this.handleCanvasMouseMove)
        this.graphCanvas?.removeEventListener('mouseleave', this.handleCanvasMouseLeave)
    }

    ngAfterViewInit(): void {
        this.isViewReady = true
        this.drawEmptyGraph('Click the graph to calculate DPS')

        const canvas = document.getElementById('graph') as HTMLCanvasElement | null
        if (canvas) {
            this.graphCanvas = canvas
            this.resizeObserver = new ResizeObserver(() => this.redrawCurrentGraph())
            this.resizeObserver.observe(canvas)
            canvas.addEventListener('mousemove', this.handleCanvasMouseMove)
            canvas.addEventListener('mouseleave', this.handleCanvasMouseLeave)
        }
        this.queueGraphRender()
    }
}
