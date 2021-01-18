import { Area } from '@/components/Area/Area';
import { CircleArea } from '@/components/Area/CircleArea';
import { PolygonArea } from '@/components/Area/PolygonArea';

export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 800;

export const RULER_WIDTH = 50;
export const WORKSPACE_WIDTH = CANVAS_WIDTH - RULER_WIDTH;
export const WORKSPACE_HEIGHT = CANVAS_HEIGHT - RULER_WIDTH;

export const WORKSPACE_CENTER = [
  Math.round(WORKSPACE_WIDTH / 2) + RULER_WIDTH,
  Math.round(WORKSPACE_HEIGHT / 2) + RULER_WIDTH,
];

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
  thickness?: number;
  globalAlpha?: number;
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
    this.drawRuler();
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
      strokeColor: 'black',
      thickness: 3,
      ...options ?? {},
    };
    const { ctx } = this;
    if (area instanceof PolygonArea) {
      this.drawPolygon(area.points, opt);
      ctx.beginPath();
      const [lsx, lsy] =  area.points[0];
      const [rsx, rsy] =  area.points[1];
      ctx.strokeStyle = 'grey';
      ctx.moveTo(lsx, lsy);
      ctx.lineTo(lsx, 0)
      ctx.stroke();
      ctx.moveTo(rsx, rsy);
      ctx.lineTo(rsx, 0)
      ctx.stroke();
      ctx.closePath();

    } else if (area instanceof CircleArea) {
      this.drawCircle({ x: area.x, y: area.y, r: area.r }, opt);
    }
  }

  private drawBorders(): void {
    const { ctx } = this;
    ctx.strokeStyle = 'yellow';
    // ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  private drawRuler(): void {
    const { ctx } = this;
    for (let i = 0; i < Math.ceil(WORKSPACE_WIDTH / 10); i += 1) {
      ctx.strokeStyle = 'grey';
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(i * 10 + RULER_WIDTH, RULER_WIDTH);
      ctx.lineTo(i * 10 + RULER_WIDTH, WORKSPACE_HEIGHT + RULER_WIDTH);
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(i * 10 + RULER_WIDTH, RULER_WIDTH);
      if (i * 10 !== 0 && (i * 10) % 100 === 0) {
        ctx.lineTo(i * 10 + RULER_WIDTH, RULER_WIDTH - RULER_WIDTH * 0.4);
        ctx.font = '10px Arial';
        ctx.strokeText(`${i * 10}`, i * 10 + RULER_WIDTH + 5, RULER_WIDTH - RULER_WIDTH * 0.3);
      } else {
        ctx.lineTo(i * 10 + RULER_WIDTH, RULER_WIDTH - RULER_WIDTH * 0.2);
      }
      ctx.stroke();
      ctx.closePath();
    }
    for (let i = 0; i < Math.ceil(WORKSPACE_HEIGHT / 10); i += 1) {
      ctx.strokeStyle = 'grey';
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.moveTo(RULER_WIDTH, i * 10 + RULER_WIDTH);
      ctx.lineTo(RULER_WIDTH + WORKSPACE_WIDTH, i * 10 + RULER_WIDTH);
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(RULER_WIDTH, i * 10 + RULER_WIDTH);
      if ((i * 10) % 100 === 0) {
        ctx.lineTo(RULER_WIDTH - RULER_WIDTH * 0.8, i * 10 + RULER_WIDTH);
        ctx.font = '10px Arial';
        ctx.strokeText(`${i * 10}`, 1, i * 10 + RULER_WIDTH + 12);
      } else {
        ctx.lineTo(RULER_WIDTH - RULER_WIDTH * 0.3, i * 10 + RULER_WIDTH);
      }
      ctx.stroke();
      ctx.closePath();
    }
  }

  private drawCircle(
    { x, y, r }: Circle,
    {
      strokeColor,
      fillColor,
      thickness,
      globalAlpha,
    }: DrawOptions,
  ): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.strokeStyle = strokeColor ?? 'black';
    if (thickness) {
      ctx.lineWidth = thickness;
      ctx.arc(x, y, r + thickness / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.arc(x, y, r, 0, Math.PI * 2);
    } else {
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    if (fillColor) {
      ctx.globalAlpha = globalAlpha ?? 1;
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;
  }

  private drawPolygon = (
    points: Coordinate[],
    { strokeColor, fillColor, thickness }: DrawOptions,
  ): void => {
    const { ctx } = this;
    ctx.strokeStyle = strokeColor ?? 'grey';
    ctx.beginPath();
    if (thickness) {
      ctx.lineWidth = thickness;
    }
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
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.closePath();
    ctx.lineWidth = 1;
  }
}
