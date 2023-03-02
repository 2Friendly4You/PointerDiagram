package de.tobiasrick.pointerdiagram;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.shape.Rectangle;

public class StrokeShape {
    public static void strokeShape(GraphicsContext gc, PointerCanvas.DrawableShape shape) {
        if (shape.shape() instanceof Rectangle rec) {
            gc.setFill(shape.fillColor());
            gc.setStroke(shape.strokeColor());
            gc.fillRect(rec.getX(), rec.getY(), rec.getWidth(), rec.getHeight());
        }
    }
}
