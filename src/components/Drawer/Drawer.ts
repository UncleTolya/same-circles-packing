import { Area } from '@/components/Area/Area';
import { CircleArea } from '@/components/Area/CircleArea';
import { PolygonArea } from '@/components/Area/PolygonArea';

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;

export type Coordinate = [number, number];

export interface Polygon {
  points: Coordinate[];
}
export interface Circle {
  x: number;
  y: number;
  r: number;
}

type DrawElement = Polygon | Circle;

interface DrawOptions {
  index?: number;
  strokeColor?: string;
  fillColor?: string;
}

export class Drawer {
  constructor(private ctx: CanvasRenderingContext2D) {
    this.resetCanvas();
  }

  public draw(
    entity: Area | DrawElement,
    options?: DrawOptions,
  ) {
    if (entity instanceof Area) {
      return this.drawArea(entity, options);
    }
    return this.drawElement(entity, options);
  }

  public resetCanvas(): void {
    this.fillCanvas();
    this.drawBorders();
  }

  private fillCanvas(): void {
    const { ctx } = this;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  private drawElement(
    element: DrawElement,
    options?: DrawOptions,
  ): void {
    const opt = {
      fillColor: 'green',
      strokeColor: 'grey',
      ...options ?? {},
    };
    if ((element as Polygon).points) {
      this.drawPolygon((element as Polygon).points, opt);
    } else {
      this.drawCircle(element as Circle, opt);
    }
  }

  private drawArea(
    area: Area,
    options?: DrawOptions,
  ): void {
    const opt = {
      strokeColor: 'grey',
      fillColor: 'white',
      ...options ?? {},
    };
    if (area instanceof PolygonArea) {
      this.drawPolygon(area.points, opt);
    } else if (area instanceof CircleArea) {
      this.drawCircle({ x: area.x, y: area.y, r: area.r }, opt);
    }
  }

  private drawBorders(): void {
    const { ctx } = this;
    ctx.strokeStyle = 'red';
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  private drawCircle(
    { x, y, r }: Circle,
    { strokeColor, fillColor }: DrawOptions,
  ): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fillColor ?? 'black';
    ctx.fill();
    ctx.strokeStyle = strokeColor ?? 'grey';
    ctx.stroke();
    ctx.closePath();
  }

  private drawPolygon = (
    points: Coordinate[],
    { strokeColor, fillColor }: DrawOptions,
  ): void => {
    const { ctx } = this;
    ctx.strokeStyle = strokeColor ?? 'grey';
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (!index) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (!index) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.fillStyle = fillColor ?? 'black';
    ctx.fill();
    ctx.closePath();
  }
}
