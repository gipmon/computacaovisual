#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QLabel>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

private slots:

    void on_pushButton_3_clicked();

    void on_pushButton_4_clicked();

    void on_pushButton_clicked();

    void on_pushButton_2_clicked();

    void on_horizontalSlider_3_valueChanged(int value);

    void on_horizontalSlider_valueChanged(int value);

    void on_horizontalSlider_2_valueChanged(int value);

    void on_pushButton_5_clicked();

    void on_red_hist_clicked();

    void on_green_hist_clicked();

    void on_blue_hist_clicked();

    void on_y_hist_clicked();

    void on_contrast_valueChanged(int value);

    void on_brightness_valueChanged(int value);

    void on_pushButton_7_clicked();

private:
    Ui::MainWindow *ui;
    cv::Mat photo;
    cv::Mat photo_original;
    cv::Mat histogram_r;
    cv::Mat histogram_g;
    cv::Mat histogram_b;
    cv::Mat histogram;
    void setHistogram();
    void reloadImageAndHistogram();
    void RGB_slider();
};

#endif // MAINWINDOW_H
