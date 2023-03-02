module de.tobiasrick.pointerdiagram {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.web;
    requires javafx.swing;

    requires org.controlsfx.controls;
    requires com.dlsc.formsfx;
    requires net.synedra.validatorfx;
    requires org.kordamp.ikonli.javafx;
    requires org.kordamp.bootstrapfx.core;
    requires java.prefs;

    opens de.tobiasrick.pointerdiagram to javafx.fxml;
    exports de.tobiasrick.pointerdiagram;
    exports de.tobiasrick.pointerdiagram.canvas;
    opens de.tobiasrick.pointerdiagram.canvas to javafx.fxml;
}