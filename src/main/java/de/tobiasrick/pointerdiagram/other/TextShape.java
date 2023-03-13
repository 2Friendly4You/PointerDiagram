package de.tobiasrick.pointerdiagram.other;

import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;

public class TextShape {
    private Color color;
    private final Font font;
    private final String text;
    private double x;
    private double y;
    private final GraphicsContext gc;

    public TextShape(GraphicsContext graphicsContext, String text, Font font, Color color) {
        this.gc = graphicsContext;
        this.text = text;
        this.font = font;
        this.color = color;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Font getFont() {
        return font;
    }

    public String getText() {
        return text;
    }

    public void draw(double x, double y) {
        gc.setStroke(getColor());
        gc.setFill(getColor());
        gc.setFont(getFont());
        gc.fillText(getText(), x, y);
    }
}
