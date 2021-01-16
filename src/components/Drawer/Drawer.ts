import { Area } from "@/components/Area/Area";
import { PolygonArea } from "@/components/Area/PolygonArea";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const BORDER_COLOR = 'red';
const AREA_COLOR = 'grey';
const DRAW_ELEMENT_COLOR = 'green';

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
  color?: string;
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
    if ((element as Polygon).points) {
      this.drawPolygon((element as Polygon).points, options?.color ?? DRAW_ELEMENT_COLOR);
    } else {
      this.drawCircle(element as Circle, options?.color ?? DRAW_ELEMENT_COLOR)
    }
  }

  private drawArea(
    area: Area,
    options?: DrawOptions,
  ): void {
    if (area instanceof PolygonArea) {
      this.drawPolygon(area.points,options?.color ?? AREA_COLOR);
    }
  }

  private drawBorders(): void {
    const { ctx } = this;
    ctx.strokeStyle = BORDER_COLOR;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  private drawCircle(
    { x, y, r }: Circle,
    color: string,
  ): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'grey';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  private drawPolygon = (
    points: Coordinate[],
    color: string,
  ): void => {
    const { ctx } = this;
    ctx.strokeStyle = color;
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
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }
}
