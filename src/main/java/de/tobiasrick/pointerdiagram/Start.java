package de.tobiasrick.pointerdiagram;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

import java.awt.*;
import java.io.IOException;
import java.util.prefs.Preferences;
import java.util.Locale;

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

        // load language from settings
        Locale loc = new Locale(prefs.get("language", "en"));
        I18N.setLocale(loc);

        // show window
        stage.show();


        try {
            FXMLLoader fxmlLoader2 = new FXMLLoader(Start.class.getResource("BasePointerAdder.fxml"));
            Parent root1 = fxmlLoader2.load();
            Stage stage2 = new Stage();
            stage2.setTitle("My New Stage Title");
            stage2.setScene(new Scene(root1));
            stage2.show();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        launch();
    }
}