module de.tobiasrick.pointerdiagram {
    requires javafx.controls;
    requires javafx.fxml;

    requires java.prefs;
    requires javafx.swing;

    opens de.tobiasrick.pointerdiagram to javafx.fxml;
    exports de.tobiasrick.pointerdiagram;
    exports de.tobiasrick.pointerdiagram.canvas;
    opens de.tobiasrick.pointerdiagram.canvas to javafx.fxml;
}