package de.tobiasrick.pointerdiagram.pointer;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;

/**
 * A class for the canvas that can draw ExtensionPointers. These are added to a BasePointer as an extension
 *
 * @author Tobias Rick
 */
public class ExtensionPointer extends Pointer{
    public ExtensionPointer(GraphicsContext gc, int x1, int y1, int x2, int y2) {
        super(gc, x1, y1, x2, y2);
    }

    public ExtensionPointer(GraphicsContext gc, int x1, int y1, int x2, int y2, Color strokeColor, Color fillColor) {
        super(gc, x1, y1, x2, y2, strokeColor, fillColor);
    }
}
