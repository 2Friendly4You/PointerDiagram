package de.tobiasrick.pointerdiagram;

import javafx.embed.swing.SwingFXUtils;
import javafx.scene.SnapshotParameters;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.shape.Rectangle;
import javafx.scene.shape.Shape;
import javafx.scene.image.WritableImage;
import javafx.scene.paint.Color;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PointerCanvas extends Canvas {
    private final List<DrawableShape> shapes = new ArrayList<>();

    public PointerCanvas(){
        super(2000, 2000);

        // set fill for rectangle
        addShape(new DrawableShape(new Rectangle(10, 10, 700, 700), Color.BLACK, Color.RED));
        addShape(new DrawableShape(new Rectangle(20, 20, 20, 20), Color.GREEN, Color.BLACK));

        resizeCanvasToContent(this);
    }

    public void addShape(DrawableShape shape) {
        shapes.add(shape);
        drawShapes();
    }

    public void removeShape(DrawableShape shape) {
        shapes.remove(shape);
        drawShapes();
    }

    public void clearShapes() {
        shapes.clear();
        GraphicsContext gc = getGraphicsContext2D();
        gc.clearRect(0, 0, getWidth(), getHeight());
    }

    private void drawShapes() {
        GraphicsContext gc = getGraphicsContext2D();
        gc.clearRect(0, 0, getWidth(), getHeight());
        for (DrawableShape shape : shapes) {
            StrokeShape.strokeShape(gc, shape);
        }
    }

    /**
     * Resize the canvas to its contens
     * @param canvas The canvas that sould be resized
     */
    public static void resizeCanvasToContent(Canvas canvas) {
        // Take a snapshot of the canvas
        SnapshotParameters params = new SnapshotParameters();
        params.setFill(Color.TRANSPARENT); // ensure transparency is preserved
        WritableImage snapshot = canvas.snapshot(params, null);

        // Find the dimensions of the content on the canvas
        double minX = Double.MAX_VALUE;
        double minY = Double.MAX_VALUE;
        double maxX = Double.MIN_VALUE;
        double maxY = Double.MIN_VALUE;
        for (double x = 0; x < canvas.getWidth(); x++) {
            for (double y = 0; y < canvas.getHeight(); y++) {
                Color color = Color.rgb(
                        (snapshot.getPixelReader().getArgb((int) x, (int) y) >> 16) & 0xFF,
                        (snapshot.getPixelReader().getArgb((int) x, (int) y) >> 8) & 0xFF,
                        (snapshot.getPixelReader().getArgb((int) x, (int) y)) & 0xFF,
                        (snapshot.getPixelReader().getArgb((int) x, (int) y) >> 24) & 1
                );
                if (color.equals(Color.TRANSPARENT)) {
                    continue; // skip transparent pixels
                }
                if (x < minX) {
                    minX = x;
                }
                if (y < minY) {
                    minY = y;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (y > maxY) {
                    maxY = y;
                }
            }
        }

        canvas.setWidth(maxX+50);
        canvas.setHeight(maxY+50);
    }

    /**
     * creates a file Chooser Dialog and then proceeds to save the canvas in the given file
     *
     * @param primaryStage The stage the file chooser should belong to
     * @param canvas The canvas to draw to the file
     * @param type The image type - supported types: png
     */
    public static void saveImage(Stage primaryStage, Canvas canvas, String type){
        FileChooser saveFile = new FileChooser();
        saveFile.titleProperty().bind(I18N.createStringBinding("window.title.saveCanvasToPng"));
        FileChooser.ExtensionFilter extensionFilter = new FileChooser.ExtensionFilter("PNG Files", "*.png");
        saveFile.getExtensionFilters().add(extensionFilter);

        File file = saveFile.showSaveDialog(primaryStage);

        // Take a snapshot of the canvas
        SnapshotParameters params = new SnapshotParameters();
        params.setFill(Color.TRANSPARENT); // ensure transparency is preserved
        WritableImage snapshot = canvas.snapshot(params, null);

        try {
            ImageIO.write(SwingFXUtils.fromFXImage(snapshot, null), type, file);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public record DrawableShape(Shape shape, Color strokeColor, Color fillColor) {
    }
}
