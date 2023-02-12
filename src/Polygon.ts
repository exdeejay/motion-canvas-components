import { Line, LineProps } from '@motion-canvas/2d/lib/components';
import { computed, initial, signal } from '@motion-canvas/2d/lib/decorators';
import { Length } from '@motion-canvas/2d/lib/partials';
import { SignalContext, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Rect, SerializedVector2, Vector2 } from '@motion-canvas/core/lib/types';
import { debug } from '@motion-canvas/core/lib/utils';

export interface PolygonProps extends LineProps {
  sides?: number;
}

export class Polygon extends Line {
  @initial(5)
  @signal()
  public declare readonly sides: SimpleSignal<number, this>;

  public constructor(props: PolygonProps) {
    super({
      closed: true,
      lineCap: 'round',
      points: [],
      width: 0,
      height: 0,
      ...props,
    });

    this.size.x.context.get = SignalContext.prototype.get;
    this.size.y.context.get = SignalContext.prototype.get;

    if (props.points === undefined) {
      this.points.context.setInitial(this.createPoints.bind(this));
      this.points.reset();
    }
  }

  protected createPoints() {
    const points = [];
    const sides = this.sides();
    for (let i = 0; i < Math.ceil(sides); i++) {
      points.push(
        new Vector2([
          Math.cos(Math.PI * (-1 / 2 + (2 / sides) * i)),
          Math.sin(Math.PI * (-1 / 2 + (2 / sides) * i)),
        ]),
      );
    }
    points.push(new Vector2([
      0, -1
    ]));
    
    return points.map(point => point.scale(0.5).mul(this.size()));
  }
}
