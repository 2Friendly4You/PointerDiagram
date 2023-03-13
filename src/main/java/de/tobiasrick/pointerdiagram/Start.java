package de.tobiasrick.pointerdiagram;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

import java.awt.*;
import java.io.IOException;
import java.util.prefs.Preferences;

/**
 * Main class that starts the program
 *
 * @author Tobias Rick
 */
public class Start extends Application {
    public static Stage stage;
    // user settings
    public static Preferences prefs;

    @Override
    public void start(Stage stage) throws IOException {
        // settings are loaded
        prefs = Preferences.userRoot().node("settings");

        // icon is loaded
        Image icon = new Image("icon.png");

        // scene is loaded
        FXMLLoader fxmlLoader = new FXMLLoader(Start.class.getResource("main.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 640, 400);
        Start.stage = stage;
        stage.titleProperty().bind(I18N.createStringBinding("window.title"));
        stage.setScene(scene);
        // set window icon
        stage.getIcons().add(icon);

        // set taskbar icon
        if(Taskbar.isTaskbarSupported()){
            Taskbar taskbar = Taskbar.getTaskbar();
            if(taskbar.isSupported(Taskbar.Feature.ICON_IMAGE)){
                final Toolkit toolkit = Toolkit.getDefaultToolkit();
                var dockIcon = toolkit.getImage(getClass().getResource("/icon.png"));
                taskbar.setIconImage(dockIcon);
            }
        }

        // show window
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}