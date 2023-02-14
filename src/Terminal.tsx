import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SimpleSignal } from "@motion-canvas/core/lib/signals";
import { cancel, ThreadGenerator } from "@motion-canvas/core/lib/threading";
import { createRef, debug } from "@motion-canvas/core/lib/utils";
import { loop, waitFor } from "@motion-canvas/core/lib/flow";
import { InterpolationFunction, TimingFunction } from "@motion-canvas/core/lib/tweening";
import { Text, Rect, RectProps } from "@motion-canvas/2d/lib/components";
import type { PossibleColor } from "@motion-canvas/core/lib/types/Color.d.ts";

export interface TerminalProps extends RectProps {
  cursorType?: 'none' | 'line' | 'block',
  blinkSpeed?: number
};

export class Terminal extends Rect {
  
  public textStyle = {
    fill: '#eee',
    fontFamily: 'JetBrains Mono',
    fontSize: 48,
    height: 64,
  };
  
  @initial('none')
  @signal()
  public declare readonly cursorType: SimpleSignal<'none' | 'line' | 'block', this>;
  @initial(0.8)
  @signal()
  public declare readonly blinkSpeed: SimpleSignal<number, this>;
  
  protected cursor = new Rect({
    width: 32,
    height: '100%',
    fill: "white",
  });
  protected cursorBlinkTask: any = null;
  
  public constructor(props: TerminalProps) {
    super({
      layout: true,
      direction: 'column',
      size: [1200, 800],
      fill: "#222",
      radius: 16,
      padding: 32,
      textWrap: 'pre',
      clip: true,
      ...props,
    });
  }
  
  public *blink(enable: boolean = true): ThreadGenerator {
    if (enable && this.cursorBlinkTask === null) {
      this.cursorBlinkTask = yield loop(Infinity, function* (this: Terminal) {
        this.cursor.fill(null);
        yield* waitFor(this.blinkSpeed()/2);
        this.cursor.fill('white');
        yield* waitFor(this.blinkSpeed()/2);
      }.bind(this));
    } else {
      if (this.cursorBlinkTask !== null) {
        cancel(this.cursorBlinkTask);
        this.cursor.fill('white');
        this.cursorBlinkTask = null;
      }
    }
  }
  

  /**
  * Makes the terminal prompt
  *
  *  @param promptText - The prompt of the terminal
  *  @param color - The prompt color
  */
  public *prompt(promptText: string = '$ ', color: PossibleColor = "#4d3") {
    this.add(
      <Rect layout>
        <Text text={promptText} {...this.textStyle} fill={color} fontWeight={800} />
        {this.cursor}
      </Rect>
    )
    yield* this.blink();
    return this;
  }

  /**
  * Clears the terminal.
  *
  *  @param fakeClear - When set to `true`, clear will be typed in the 
                        terminal before clearing it. Setting it to 
                        `false` instantly clears the terminal.
  *  @param time - The time after clear is typed to clean the terminal 
  */
  public *clear(fakeClear: boolean = true, time: number = 0.2) {
    if (fakeClear) {
      yield* this.type("clear", 1);
      yield* waitFor(time);
    }
    for (const item of this.children()) {
      item.remove()
    }
    yield* this.prompt()
  }
  
  public *type(content: string, time: number, timingFunction?: TimingFunction, interpolationFunction?: InterpolationFunction<string>) {
    yield* this.blink(false);
    const last = this.children()[this.children().length - 1];
    const text = createRef<Text>();
    last.add(
      <Text ref={text} {...this.textStyle} />
    )
    last.add(this.cursor)
    yield* text().text(content, time, timingFunction, interpolationFunction);
    yield* this.blink();
  }
    
  public newline() {
    this.add(
      <Rect layout>
        <Text {...this.textStyle} />
        {this.cursor}
      </Rect>
    )
  }
    
  public line(content: string) {
    let [first, ...lines] = content.split('\n');
    let last = this.children()[this.children().length - 1];
    //debug(last.children().map(i => Object.getPrototypeOf(i).constructor == Text)); //Causes
    let textElems = last.children().filter((i): i is Text => Object.getPrototypeOf(i).constructor === Text)
    let lastText = textElems[textElems.length - 1];
    lastText.text(lastText.text() + first);
    lines.map(l => {
      this.add(
        <Rect layout>
          <Text text={l} {...this.textStyle} />
        </Rect>
      )
    })
  }
}
