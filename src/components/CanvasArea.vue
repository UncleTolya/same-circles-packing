<template>
  <div>
    <div style="width: 100%; display: flex; padding: 1rem">
      <div style="
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 1rem;
      ">
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-bottom: 3rem;
        ">
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">
              <div>Радиус элемента: </div>
              <AInputNumber
                :min="minRadius"
                :max="maxRadius"
                size="small"
                v-model="radius"
              />
            </div>
            <ASlider
              :min="minRadius"
              :max="maxRadius"
              v-model="radius"
            />

          </div>
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">
              <div>Длина серии (S): </div>
              <AInputNumber
                :min="minS"
                :max="maxS"
                size="small"
                v-model="s"
              />
            </div>
            <ASlider
              :min="minS"
              :max="maxS"
              v-model="s"
            />
          </div>
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Кол-во параллелей (P): </div>
                <AInputNumber
                  :min="minP"
                  :max="maxP"
                  size="small"
                  v-model="p"
                />
              </div>
              <ASlider
                :min="minP"
                :max="maxP"
                v-model="p"
              />
            </div>
          </div>
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Вес элемента: </div>
                <AInputNumber
                  :min="minW"
                  :max="maxW"
                  size="small"
                  v-model="w"
                />
              </div>
              <ASlider
                :min="minW"
                :max="maxW"
                v-model="w"
              />
            </div>
          </div>
        </div>
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        ">
          <ARadioGroup
            :value="areaType"
            buttonStyle="solid"
            size="small"
            style="display: flex; margin-bottom: 1rem"
          >
            <ARadioButton
              :key="AreaType.CIRCLE"
              style="flex: 1"
              :value="AreaType.CIRCLE"
              @click="areaType = AreaType.CIRCLE"
            >
              <AIcon type="circle"></AIcon>
              Круг
            </ARadioButton>
            <ARadioButton
              :key="AreaType.RECTANGLE"
              style="flex: 1"
              :value="AreaType.RECTANGLE"
              @click="areaType = AreaType.RECTANGLE"
            >
              <AIcon type="square"></AIcon>
              Прямоугольник
            </ARadioButton>
          </ARadioGroup>
          <div
            v-if="areaType === AreaType.CIRCLE"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Радиус: </div>
              <AInputNumber
                :min="radius"
                :max="Math.floor(maxHeight / 2 - 2)"
                size="small"
                v-model="areaRadius"
              />
            </div>
            <ASlider
              :min="radius"
              :max="Math.floor(maxHeight / 2 - 2)"
              v-model="areaRadius"
            />
          </div>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Ширина: </div>
              <AInputNumber
                :min="minWidth"
                :max="maxWidth"
                size="small"
                v-model="width"
              />
            </div>
            <ASlider
              :min="minWidth"
              :max="maxWidth"
              v-model="width"
            />
          </div>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Высота: </div>
              <AInputNumber
                :min="minHeight"
                :max="maxHeight"
                size="small"
                v-model="height"
              />
            </div>
            <ASlider
              :min="minHeight"
              :max="maxHeight"
              v-model="height"
            />
          </div>
          <div
            v-if="areaType === AreaType.CIRCLE"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Отступ: </div>
                <AInputNumber
                  :min="minOffset"
                  :max="maxRadiusOffset"
                  size="small"
                  v-model="radiusOffset"
                />
              </div>
              <ASlider
                :min="minOffset"
                :max="maxRadiusOffset"
                v-model="radiusOffset"
              />
            </div>
          </div>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Отступ высота: </div>
                <AInputNumber
                  :min="minOffset"
                  :max="maxHeightOffset"
                  size="small"
                  v-model="heightOffset"
                />
              </div>
              <ASlider
                :min="minOffset"
                :max="maxHeightOffset"
                v-model="heightOffset"
              />
            </div>
          </div>
          <ACheckbox
            v-if="areaType === AreaType.RECTANGLE"
            :checked="linkOffsets"
            @change="({ target }) => linkOffsets = target.checked"
          ></ACheckbox>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column"
          >
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Отступ ширина: </div>
                <AInputNumber
                  v-if="!linkOffsets"
                  :min="minOffset"
                  :max="maxWidthOffset"
                  size="small"
                  v-model="widthOffset"
                />
                <AInputNumber
                  v-else
                  disabled
                  :min="minOffset"
                  :max="maxWidthOffset"
                  size="small"
                  v-model="heightOffset"
                />
              </div>
              <ASlider
                v-show="!linkOffsets"
                :min="minOffset"
                :max="maxWidthOffset"
                v-model="widthOffset"
              />
            </div>
          </div>
        </div>
      </div>
      <canvas id="canvas" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT"></canvas>
    </div>
    <div v-if="computedUpdate && false"></div>
  </div>
</template>

<script lang="ts">
import { CircleArea } from '@/components/Area/CircleArea';
import { RectangleArea } from '@/components/Area/RectangleArea';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  Coordinate,
  Drawer,
  WORKSPACE_WIDTH,
  WORKSPACE_HEIGHT, WORKSPACE_CENTER,
} from '@/components/Drawer/Drawer';
import { getFittedCentresRightLine, getFittedCentresSpiral, noop } from '@/components/utils';
import { Component } from 'vue-property-decorator';
import {
  InputNumber,
  Slider,
  Dropdown,
  Radio,
  Icon, Checkbox,
} from 'ant-design-vue';
import Vue from 'vue';
import 'ant-design-vue/dist/antd.css';
import { Area } from '@/components/Area/Area';

// TODO сделать начало отсчета от левого края самой длинный стороны многоугольника
// TODO и не корень из трех а динамический угол

enum AreaType {
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
}

@Component({
  components: {
    [Dropdown.name]: Dropdown,
    [InputNumber.name]: InputNumber,
    [Slider.name]: Slider,
    [Icon.name]: Icon,
    [Radio.Button.name]: Radio.Button,
    [Radio.Group.name]: Radio.Group,
    [Checkbox.name]: Checkbox,
  },
  data() {
    return {
      AreaType,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      WORKSPACE_WIDTH,
      WORKSPACE_HEIGHT,
    };
  },
})
export default class CanvasArea extends Vue {
  private widthOffset = 0;
  private heightOffset = 0;
  private radiusOffset = 0;

  private linkOffsets = true;

  private areaType: AreaType = AreaType.CIRCLE;

  private minRadius = 10;
  private maxRadius = 100;
  private radius = 18;

  private areaRadius = Math.min(this.maxWidth, this.maxHeight) / 4;

  private width = this.maxWidth / 2;
  private height = this.maxHeight / 2;

  private minOffset = 0;

  private s = 1;
  private minS = 1;
  private maxS = 100;

  private p = 37;
  private minP = 0;
  private maxP = 1000;

  private w = 50;
  private minW = 1;
  private maxW = 100;

  private drawer!: Drawer;

  // eslint-disable-next-line class-methods-use-this
  private get maxWidth(): number {
    return WORKSPACE_WIDTH - 2;
  }

  private get minWidth(): number {
    return this.radius * 2 + 2;
  }
  private get maxWidthOffset(): number {
    return (this.width + 2) / 2;
  }

  // eslint-disable-next-line class-methods-use-this
  private get maxRadiusOffset(): number {
    return this.areaRadius;
  }

  // eslint-disable-next-line class-methods-use-this
  private get maxHeight(): number {
    return WORKSPACE_HEIGHT - 2;
  }

  private get minHeight(): number {
    return this.radius * 2 + 2;
  }
  private get maxHeightOffset(): number {
    return (this.height + 2) / 2;
  }

  private get computedUpdate(): boolean {
    const {
      radius,
      rectangleArea,
      circleArea,
      areaRadius,
      areaType,
      drawer,
      s,
      p,
      maxRadius,
      minRadius,
    } = this;
    noop(radius, rectangleArea, s, p, drawer, circleArea, areaRadius, areaType);
    if (radius < minRadius || radius > maxRadius || !drawer) {
      return false;
    }
    this.redraw();
    return true;
  }

  private redraw(): void {
    const {
      radius,
      area,
      shell,
      drawer,
      totalElementCount,
      fittedCentres,
      areaType,
      radiusOffset,
      widthOffset,
      heightOffset,
    } = this;
    drawer.resetCanvas();
    const hasOffset = areaType === AreaType.CIRCLE
      ? radiusOffset
      : widthOffset || heightOffset;
    const areaStrokeColor = fittedCentres.length < totalElementCount
      ? 'rgba(211, 33, 45, 0.5)'
      : 'black';
    const elementFillColor = fittedCentres.length < totalElementCount
      ? 'white'
      : '#0a63ae';
    drawer.draw(shell, { strokeColor: areaStrokeColor });
    drawer.drawSizes(shell, Math.cos(45));
    if (hasOffset && area.isExists()) {
      drawer.draw(area, {
        strokeColor: fittedCentres.length < totalElementCount
          ? 'rgba(211, 33, 45, 0.5)'
          : 'black',
        thickness: undefined,
        index: 1,
      });
      drawer.drawSizes(area, -Math.cos(45), 1);
    }
    fittedCentres.forEach(([x, y]) => {
      const circle = { x, y, r: radius };
      drawer.draw(
        circle,
        {
          fillColor: elementFillColor,
          strokeColor: 'grey',
          globalAlpha: 0.3,
        },
      );
    });
    const lastElement = fittedCentres[fittedCentres.length - 1];
    drawer.drawCircleSizes(
      {
        x: lastElement[0],
        y: lastElement[1],
        r: radius,
      },
      -Math.cos(60),
    );
  }

  private get area(): Area {
    return this.areaType === AreaType.RECTANGLE
      ? this.rectangleArea
      : this.circleArea;
  }

  private get shell(): Area {
    return this.areaType === AreaType.RECTANGLE
      ? this.rectangleShell
      : this.circleShell;
  }

  private get totalElementCount(): number {
    return this.s * this.p;
  }

  private get fittedCentres(): Coordinate[] {
    const {
      radius,
      rectangleArea,
      circleArea,
      totalElementCount,
    } = this;
    return this.areaType === AreaType.RECTANGLE
      ? getFittedCentresRightLine(rectangleArea, radius, totalElementCount)
      : getFittedCentresSpiral(circleArea, radius, totalElementCount);
  }

  private get rectangleArea(): RectangleArea {
    const {
      width,
      height,
      widthOffset,
      heightOffset,
      linkOffsets,
    } = this;
    const widthOff = linkOffsets
      ? heightOffset
      : widthOffset;
    const [xc, yc] = WORKSPACE_CENTER;
    const [xs, ys] = [Math.round(xc - width / 2), Math.round(yc - height / 2)];
    return new RectangleArea([
      [xs + widthOff, ys + heightOffset],
      [xs + width - widthOff, ys + heightOffset],
      [xs + width - widthOff, ys + height - heightOffset],
      [xs + widthOff, ys + height - heightOffset],
      [xs + widthOff, ys + heightOffset],
    ]);
  }

  private get rectangleShell(): RectangleArea {
    const { width, height } = this;
    const [xc, yc] = WORKSPACE_CENTER;
    const [xs, ys] = [Math.round(xc - width / 2), Math.round(yc - height / 2)];
    return new RectangleArea([
      [xs, ys],
      [xs + width, ys],
      [xs + width, ys + height],
      [xs, ys + height],
      [xs, ys],
    ]);
  }

  private get circleArea(): CircleArea {
    const [x, y] = WORKSPACE_CENTER;
    return new CircleArea(x, y, this.areaRadius - this.radiusOffset);
  }

  private get circleShell(): CircleArea {
    const [x, y] = WORKSPACE_CENTER;
    return new CircleArea(x, y, this.areaRadius);
  }

  private mounted(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not found');
    }
    this.drawer = new Drawer(ctx);
    this.redraw();
  }
}
</script>
