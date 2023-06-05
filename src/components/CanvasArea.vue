<template>
  <div style="display: flex; flex-direction: column">
    <div style="width: 100%">
      <AInput
        v-model="title"
        placeholder="Без названия"
        style="width: 90%; font-weight: 700; font-size: 2rem; border: none"
        size="large"
      ></AInput>
    </div>
    <div style="width: 100%; display: flex; padding: 1rem; align-items: flex-start;">
      <div style="
        width: 20rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 1rem;
        font-size: .9rem;
      " :style="{ height: CANVAS_HEIGHT }">
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-bottom: 3rem;
        ">
          <div style="display: flex; flex-direction: column; position: relative; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between">
              <div>Диаметр элемента, мм: </div>
              <AInputNumber
                :min="minDiam"
                :max="maxDiam"
                size="small"
                v-model="diam"
              />
            </div>
            <ASlider
              v-show="showSliders"
              v-model="diam"
              :min="minDiam"
              :max="maxDiam"
            />
          </div>
          <div style="display: flex; flex-direction: column; position: relative; margin-bottom: 1rem;">
            <div style="position: absolute; top: 0; left: -1.5rem">
              <ATooltip placement="topLeft" v-model="isSTooltipVisible">
                <template #title>
                  <span> Количество последовательно соединенных блоков батареи . При этом типе соединения напряжение всех последовательно соединенных  элементов складывается. Это позволяет сделать батарею на заданное напряжение  U=S*Uэлемента.</span>
                </template>
                <AIcon type="question-circle"/>
              </ATooltip>
            </div>
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
              v-show="showSliders"
              v-model="s"
              :min="minS"
              :max="maxS"
            />
          </div>
          <div style="display: flex; flex-direction: column; position: relative; margin-bottom: 1rem;">
            <div style="position: absolute; top: 0; left: -1.5rem">
              <ATooltip placement="topLeft" v-model="isPTooltipVisible">
                <template #title>
                  <span>Количество параллельно соединенных элементов. При этом типе соединения ёмкость сборки пропорционально увеличивается.</span>
                </template>
                <AIcon type="question-circle"/>
              </ATooltip>
            </div>
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
                v-show="showSliders"
                v-model="p"
                :min="minP"
                :max="maxP"
              />
            </div>
          </div>
          <div style="margin-bottom: 1rem">
            <div v-if="areElementsFit" style="font-weight: 700">
              Помещается: {{ fittedCentres.length }} элементов
            </div>
            <div v-else style="color: #df676f; display: flex; flex-direction: column">
              <div style="font-weight: 700">
                Помещается:
              </div>
              <div style="font-weight: 700">
                {{ fittedCentres.length }} элементов из {{ totalElementCount }}
              </div>
          </div>
          </div>
          <div style="display: flex; flex-direction: column; position: relative; margin-bottom: 1rem;">
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Вес элемента, г: </div>
                <AInputNumber
                  :min="minW"
                  :max="maxW"
                  size="small"
                  v-model="w"
                />
              </div>
              <ASlider
                v-model="w"
                v-show="showSliders"
                :min="minW"
                :max="maxW"
              />
            </div>
          </div>
          <div style="font-weight: 700">
            Итоговый вес элементов: {{ fittedCentres.length * w }} г
          </div>
        </div>
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-bottom: 1rem;
        ">
          <div style="position: relative; margin-bottom: .5rem;">
            <div style="position: absolute; top: 0; left: -1.5rem">
              <ATooltip placement="topLeft" v-model="isFormTooltipVisible">
                <template #title>
                  <span>Форма корпуса</span>
                </template>
                <AIcon type="question-circle"/>
              </ATooltip>
            </div>
            <ARadioGroup
              :value="areaType"
              buttonStyle="solid"
              size="small"
              style="display: flex; margin-bottom: 1rem; font-size: .7rem"
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
                Прямуг-ик
              </ARadioButton>
            </ARadioGroup>
          </div>
          <div
            v-if="areaType === AreaType.CIRCLE"
            style="display: flex; flex-direction: column; margin-bottom: 1rem;"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Диаметр, мм: </div>
              <AInputNumber
                :min="diam"
                :max="Math.floor(maxHeight - 2)"
                size="small"
                v-model="areaDiam"
              />
            </div>
            <ASlider
              v-model="areaDiam"
              v-show="showSliders"
              :min="diam"
              :max="Math.floor(maxHeight - 2)"
            />
          </div>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column; margin-bottom: 1rem;"
          >
            <div style="display: flex; justify-content: space-between;">
              Квадратная решётка:
              <ACheckbox
                :checked="boxGrid"
                @change="({ target }) => boxGrid = target.checked"
              ></ACheckbox>
            </div>
          </div>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column; margin-bottom: 1rem;"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Ширина, мм: </div>
              <AInputNumber
                :min="minWidth"
                :max="maxWidth"
                size="small"
                v-model="width"
              />
            </div>
            <ASlider
              v-show="showSliders"
              v-model="width"
              :min="minWidth"
              :max="maxWidth"
            />
          </div>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column; margin-bottom: 1rem;"
          >
            <div style="display: flex; justify-content: space-between">
              <div>Высота, мм: </div>
              <AInputNumber
                :min="minHeight"
                :max="maxHeight"
                size="small"
                v-model="height"
              />
            </div>
            <ASlider
              v-show="showSliders"
              v-model="height"
              :min="minHeight"
              :max="maxHeight"
            />
          </div>
          <div
            v-if="areaType === AreaType.CIRCLE"
            style="display: flex; flex-direction: column; margin-bottom: 1rem;"
          >
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Отступ, мм: </div>
                <AInputNumber
                  :min="minOffset"
                  :max="maxDiamOffset"
                  size="small"
                  v-model="diamOffset"
                />
              </div>
              <ASlider
                v-show="showSliders"
                v-model="diamOffset"
                :min="minOffset"
                :max="maxDiamOffset"
              />
            </div>
          </div>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column;"
          >
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Отступ высота, мм: </div>
                <AInputNumber
                  :min="minOffset"
                  :max="maxHeightOffset"
                  size="small"
                  v-model="heightOffset"
                />
              </div>
              <ASlider
                v-show="showSliders"
                v-model="heightOffset"
                :min="minOffset"
                :max="maxHeightOffset"
              />
            </div>
          </div>
          <div v-if="areaType === AreaType.RECTANGLE" style="display: flex; justify-content: center;">
            <div style="margin-right: .5rem">
              <ATooltip placement="topLeft" v-model="isLinkTooltipVisible">
                <template #title>
                  <span>Синхронизировать размер отступов</span>
                </template>
                <AIcon type="link"/>
              </ATooltip>
            </div>
            <ACheckbox
              :checked="linkOffsets"
              @change="({ target }) => linkOffsets = target.checked"
            ></ACheckbox>
          </div>
          <div
            v-if="areaType === AreaType.RECTANGLE"
            style="display: flex; flex-direction: column; margin-bottom: 1rem;"
          >
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; justify-content: space-between">
                <div>Отступ ширина, мм: </div>
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
                v-show="!linkOffsets && showSliders"
                v-model="widthOffset"
                :min="minOffset"
                :max="maxWidthOffset"
              />
            </div>
          </div>
        </div>
        <div style="align-self: start">
          <APopover placement="right">
            <template #content>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  margin-bottom: 1rem;
                "
              >
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                  Отображать размер отступа:
                  <ACheckbox
                    :checked="drawOffset"
                    @change="({ target }) => drawOffset = target.checked"
                  ></ACheckbox>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  Показывать ползунки:
                  <ACheckbox
                    :checked="showSliders"
                    @change="({ target }) => showSliders = target.checked"
                  ></ACheckbox>
                </div>
              </div>
            </template>
            <AButton
              size="small"
              type="dashed"
              icon="setting"
            ></AButton>
          </APopover>
        </div>
      </div>
      <canvas id="canvas" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT"></canvas>
    </div>
    <div v-if="computedUpdate && false"></div>
  </div>
</template>

<script lang="ts">
import { CircleArea } from '../components/Area/CircleArea';
import { RectangleArea } from '../components/Area/RectangleArea';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  Coordinate,
  Drawer,
  WORKSPACE_WIDTH,
  WORKSPACE_HEIGHT,
  WORKSPACE_CENTER,
} from '../components/Drawer/Drawer';
import {
  getFittedCentresRightLine,
  getFittedCentresSpiral,
  getFittedCentresBoxGrid,
  noop,
} from '../components/utils';
import { Component } from 'vue-property-decorator';
import {
  InputNumber,
  Input,
  Slider,
  Dropdown,
  Radio,
  Icon,
  Tooltip,
  Checkbox, Popover, Button,
} from 'ant-design-vue';
import Vue from 'vue';
import 'ant-design-vue/dist/antd.css';
import { Area } from '../components/Area/Area';

// TODO сделать начало отсчета от левого края самой длинный стороны многоугольника
// TODO и не корень из трех а динамический угол

enum AreaType {
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
}

@Component({
  components: {
    [Dropdown.name]: Dropdown,
    [Input.name]: Input,
    [InputNumber.name]: InputNumber,
    [Slider.name]: Slider,
    [Icon.name]: Icon,
    [Popover.name]: Popover,
    [Button.name]: Button,
    [Radio.Button.name]: Radio.Button,
    [Radio.Group.name]: Radio.Group,
    [Checkbox.name]: Checkbox,
    [Tooltip.name]: Tooltip,
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
  private title = '';

  private showSliders = false;

  private boxGrid = false;

  private isSTooltipVisible = false;
  private isPTooltipVisible = false;
  private isFormTooltipVisible = false;
  private isLinkTooltipVisible = false;

  private widthOffset = 0;
  private heightOffset = 50;
  private diamOffset = 50;

  private linkOffsets = true;
  private drawOffset = false;

  private areaType: AreaType = AreaType.CIRCLE;

  private minDiam = 15;
  private maxDiam = 100;
  private diam = 18;

  private areaDiam = Math.min(this.maxWidth, this.maxHeight) / 2;

  private width = this.maxWidth / 2;
  private height = this.maxHeight / 2;

  private minOffset = 0;

  private s = 1;
  private minS = 1;
  private maxS = 100;

  private p = 85;
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
    return this.diam + 2;
  }
  private get maxWidthOffset(): number {
    return (this.width + 2) / 2;
  }

  // eslint-disable-next-line class-methods-use-this
  private get maxDiamOffset(): number {
    return this.areaDiam / 2;
  }

  // eslint-disable-next-line class-methods-use-this
  private get maxHeight(): number {
    return WORKSPACE_HEIGHT - 2;
  }

  private get minHeight(): number {
    return this.diam + 2;
  }
  private get maxHeightOffset(): number {
    return (this.height + 2) / 2;
  }

  private get computedUpdate(): boolean {
    const {
      diam,
      rectangleArea,
      circleArea,
      areaDiam,
      areaType,
      drawer,
      s,
      p,
      maxDiam,
      minDiam,
    } = this;
    noop(diam, rectangleArea, s, p, drawer, circleArea, areaDiam, areaType);
    if (diam < minDiam || diam > maxDiam || !drawer) {
      return false;
    }
    this.redraw();
    return true;
  }

  private redraw(): void {
    const {
      diam,
      area,
      shell,
      drawer,
      fittedCentres,
      areaType,
      diamOffset,
      widthOffset,
      areElementsFit,
      heightOffset,
      drawOffset,
    } = this;
    drawer.resetCanvas();
    const hasOffset = areaType === AreaType.CIRCLE
      ? diamOffset
      : widthOffset || heightOffset;
    const areaStrokeColor = !areElementsFit
      ? 'rgba(211, 33, 45, 0.5)'
      : 'black';
    const elementFillColor = !areElementsFit
      ? 'white'
      : '#0a63ae';
    drawer.draw(shell, { strokeColor: areaStrokeColor });
    drawer.drawSizes(shell, Math.cos(45));
    if (hasOffset && area.isExists()) {
      drawer.draw(area, {
        strokeColor: !areElementsFit
          ? 'rgba(211, 33, 45, 0.5)'
          : 'black',
        thickness: undefined,
        index: 1,
      });
      if (drawOffset) {
        drawer.drawSizes(area, -Math.cos(45), 1);
      }
    }
    fittedCentres.forEach(([x, y]) => {
      const circle = { x, y, r: diam / 2 };
      drawer.draw(
        circle,
        {
          fillColor: elementFillColor,
          strokeColor: 'grey',
          globalAlpha: 0.3,
        },
      );
    });
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

  private get areElementsFit(): boolean {
    return this.totalElementCount <= this.fittedCentres.length;
  }

  private get totalElementCount(): number {
    return this.s * this.p;
  }

  private get fittedCentres(): Coordinate[] {
    const {
      diam,
      rectangleArea,
      circleArea,
      totalElementCount,
      areaType,
      boxGrid,
    } = this;
    if (areaType === AreaType.CIRCLE) {
      return getFittedCentresSpiral(circleArea, diam / 2, totalElementCount);
    }
    return boxGrid
      ? getFittedCentresBoxGrid(rectangleArea, diam / 2, totalElementCount)
      : getFittedCentresRightLine(rectangleArea, diam / 2, totalElementCount);
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
    return new CircleArea(x, y, this.areaDiam / 2 - this.diamOffset);
  }

  private get circleShell(): CircleArea {
    const [x, y] = WORKSPACE_CENTER;
    return new CircleArea(x, y, this.areaDiam / 2);
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
<style>
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;600;700&display=swap');
  .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background-color: rgb(10, 99, 174);
    border-color: rgb(10, 99, 174);
  }

  .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    background-color: rgba(10, 99, 174, 0.65);
    border-color: rgba(10, 99, 174, 0.65);
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: rgb(10, 99, 174);
    border-color: rgb(10, 99, 174);
  }

  .ant-slider-track {
    background-color: rgb(10, 99, 174);
  }

  .ant-slider-handle {
    border-color: rgb(10, 99, 174);
  }
</style>
