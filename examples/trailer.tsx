import { easeOutBack } from "@motion-canvas/core/lib/tweening";
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { createRef } from "@motion-canvas/core/lib/utils";
import { all, delay, waitFor } from '@motion-canvas/core/lib/flow';
import { Terminal } from "@dct-lulu/motion-canvas-terminal"

export default makeScene2D(function* (view) {
    const term = createRef<Terminal>();
        view.add(
                <Terminal ref={term} size={0} padding={0} cursorType={'block'} position={[450, 50]}/>
            );
        
        yield* term().prompt();
        yield* waitFor(0.5);
        yield* all(
        term().padding(32, 0.5, easeOutBack),
        term().size([800, 700], 0.5, easeOutBack),
        delay(0.8, term().type('python variables.py', 2))
        );
        term().newline();
        yield* waitFor(1);
        yield* term().prompt();
        yield* waitFor(2);
        yield* term().clear();


        yield* waitFor(1);
        yield* term().type('python variables.py', 2)
        term().newline();
        term().line('5');
        term().newline();
        term().line('Bonjour');
        yield* term().prompt();
        yield* waitFor(1);
        yield* term().clear();


        yield* waitFor(1);
        yield* term().type('python variables.py', 2)
        yield term().newline();
        yield term().line('5');
        yield term().newline();
        yield term().line('5');
        yield* term().prompt();
        yield* waitFor(1);
        yield* term().clear();

        yield* term().type('python variables.py', 2)
        yield term().newline();
        yield term().line('5');
        yield term().newline();
        yield term().line('10');
        yield* term().prompt();
        yield* waitFor(1);
        yield* term().clear();

        yield* waitFor(1);
});